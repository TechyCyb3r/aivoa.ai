"""
LangGraph AI Agent for the HCP CRM module.

Role of the agent:
The LangGraph agent acts as an intelligent field-rep co-pilot. It manages the
conversation with the rep, decides which "tool" to call based on the rep's
natural-language message, and orchestrates structured persistence of HCP
interactions. It uses Groq's gemma2-9b-it LLM for reasoning, summarization and
entity extraction.

Mandatory tools (>=5). Two are required by the assignment:
  1. log_interaction  - capture interaction data (LLM summarization + extraction)
  2. edit_interaction - modify previously logged data
Plus three sales-related tools:
  3. search_hcp       - find / create an HCP record
  4. summarize_history- summarize past interactions for an HCP
  5. suggest_next_action - recommend the next best action for the rep
"""
import json
from typing import TypedDict, Annotated, Sequence
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode, tools_condition
from app.config import settings
from app.database import SessionLocal
from app import models

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=settings.groq_api_key,
    temperature=0.2,
)


# ---------------------------------------------------------------------------
# TOOLS
# ---------------------------------------------------------------------------
@tool
def log_interaction(hcp_id: int, raw_text: str) -> str:
    """Log an interaction for an HCP. Uses the LLM to summarize the free-text
    conversation, extract sentiment, topics, products discussed and a next best
    action, then persists it to the database."""
    try:
        hcp_id = int(hcp_id)
    except (ValueError, TypeError):
        return f"Invalid hcp_id: {hcp_id}"
    prompt = (
        "You are a life-science CRM assistant. From the field rep's note below, "
        "extract a concise structured summary. Return ONLY valid JSON with keys: "
        "summary, sentiment (Positive/Neutral/Negative), topics (comma separated), "
        "products_discussed (comma separated), next_best_action, channel.\n\n"
        f"NOTE: {raw_text}"
    )
    extracted = llm.invoke(prompt).content
    # Defensive parse
    try:
        data = json.loads(extracted)
    except Exception:
        data = {
            "summary": raw_text[:300],
            "sentiment": "Neutral",
            "topics": "",
            "products_discussed": "",
            "next_best_action": "",
            "channel": "Visit",
        }
    db = SessionLocal()
    try:
        inter = models.Interaction(
            hcp_id=hcp_id,
            channel=data.get("channel"),
            summary=data.get("summary"),
            sentiment=data.get("sentiment"),
            topics=data.get("topics"),
            products_discussed=data.get("products_discussed"),
            next_best_action=data.get("next_best_action"),
            raw_transcript=raw_text,
        )
        db.add(inter)
        db.commit()
        db.refresh(inter)
        return f"Interaction #{inter.id} logged for HCP {hcp_id}: {data.get('summary')}"
    finally:
        db.close()


@tool
def edit_interaction(interaction_id: int, field: str, new_value: str) -> str:
    """Edit a previously logged interaction. field must be one of: channel,
    summary, sentiment, topics, products_discussed, next_best_action."""
    try:
        interaction_id = int(interaction_id)
    except (ValueError, TypeError):
        return f"Invalid interaction_id: {interaction_id}"
    allowed = {
        "channel", "summary", "sentiment", "topics",
        "products_discussed", "next_best_action",
    }
    if field not in allowed:
        return f"Cannot edit field '{field}'. Allowed: {', '.join(allowed)}"
    db = SessionLocal()
    try:
        inter = db.query(models.Interaction).filter(
            models.Interaction.id == interaction_id
        ).first()
        if not inter:
            return f"Interaction #{interaction_id} not found."
        setattr(inter, field, new_value)
        db.commit()
        return f"Interaction #{interaction_id} field '{field}' updated to '{new_value}'."
    finally:
        db.close()


@tool
def search_hcp(name: str = "", specialty: str = "", city: str = "") -> str:
    """Search for HCPs by name, specialty or city. If none found, returns a
    message so the agent can ask the rep to create one."""
    db = SessionLocal()
    try:
        q = db.query(models.HCP)
        if name:
            q = q.filter(models.HCP.name.ilike(f"%{name}%"))
        if specialty:
            q = q.filter(models.HCP.specialty.ilike(f"%{specialty}%"))
        if city:
            q = q.filter(models.HCP.city.ilike(f"%{city}%"))
        results = q.limit(10).all()
        if not results:
            return f"No HCP found for name='{name}' specialty='{specialty}' city='{city}'."
        out = [f"#{h.id} {h.name} ({h.designation or ''}, {h.specialty or ''}, {h.city or ''})"
               for h in results]
        return "Found HCPs:\n" + "\n".join(out)
    finally:
        db.close()


@tool
def summarize_history(hcp_id: int) -> str:
    """Summarize all past interactions for an HCP into a short briefing for the
    rep using the LLM."""
    try:
        hcp_id = int(hcp_id)
    except (ValueError, TypeError):
        return f"Invalid hcp_id: {hcp_id}"
    db = SessionLocal()
    try:
        hcp = db.query(models.HCP).filter(models.HCP.id == hcp_id).first()
        if not hcp:
            return f"HCP {hcp_id} not found."
        inters = db.query(models.Interaction).filter(
            models.Interaction.hcp_id == hcp_id
        ).order_by(models.Interaction.created_at.desc()).all()
        if not inters:
            return f"No interactions recorded yet for {hcp.name}."
        blob = "\n".join(
            f"- [{i.channel}] {i.summary} (sentiment: {i.sentiment})"
            for i in inters
        )
        prompt = (
            f"Summarize the following interaction history for HCP {hcp.name} "
            f"into a 3-4 sentence briefing highlighting relationship status and "
            f"open items:\n{blob}"
        )
        return llm.invoke(prompt).content
    finally:
        db.close()


@tool
def suggest_next_action(hcp_id: int) -> str:
    """Recommend the next best action for the rep based on the HCP's history
    and profile, using the LLM."""
    try:
        hcp_id = int(hcp_id)
    except (ValueError, TypeError):
        return f"Invalid hcp_id: {hcp_id}"
    db = SessionLocal()
    try:
        hcp = db.query(models.HCP).filter(models.HCP.id == hcp_id).first()
        if not hcp:
            return f"HCP {hcp_id} not found."
        inters = db.query(models.Interaction).filter(
            models.Interaction.hcp_id == hcp_id
        ).order_by(models.Interaction.created_at.desc()).limit(5).all()
        ctx = f"HCP: {hcp.name}, {hcp.specialty}, {hcp.hospital}.\nRecent interactions:\n"
        ctx += "\n".join(
            f"- {i.summary} (next action noted: {i.next_best_action})" for i in inters
        ) or "- none"
        prompt = (
            "As a pharma field-force strategist, suggest ONE concrete next best "
            "action (call, sample drop, invite to event, share literature, etc.) "
            "for the rep with this HCP:\n" + ctx
        )
        return llm.invoke(prompt).content
    finally:
        db.close()


TOOLS = [
    log_interaction,
    edit_interaction,
    search_hcp,
    summarize_history,
    suggest_next_action,
]
llm_with_tools = llm.bind_tools(TOOLS)


# ---------------------------------------------------------------------------
# STATE + GRAPH
# ---------------------------------------------------------------------------
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], "conversation messages"]


SYSTEM_PROMPT = (
    "You are AIVOA, an AI-first CRM co-pilot for pharmaceutical field "
    "representatives logging interactions with Healthcare Professionals (HCPs). "
    "You help reps via a conversational chat. Use the available tools to log, "
    "edit, search, summarize and recommend. Always be concise and professional."
)


def call_model(state: AgentState) -> dict:
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(state["messages"])
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


tool_node = ToolNode(TOOLS)

graph_builder = StateGraph(AgentState)
graph_builder.add_node("agent", call_model)
graph_builder.add_node("tools", tool_node)
graph_builder.set_entry_point("agent")
graph_builder.add_conditional_edges(
    "agent", tools_condition, {"tools": "tools", END: END}
)
graph_builder.add_edge("tools", "agent")
graph = graph_builder.compile()


def run_agent(hcp_id: int, message: str, history: list = None) -> dict:
    """Run the LangGraph agent for a single user turn. Returns the final reply
    and the name of the last tool used (if any)."""
    msgs = []
    for h in (history or []):
        role = h.get("role")
        content = h.get("content", "")
        if role == "user":
            msgs.append(HumanMessage(content=content))
        elif role == "assistant":
            msgs.append(AIMessage(content=content))
    msgs.append(HumanMessage(content=f"[HCP id={hcp_id}] {message}"))

    result = graph.invoke({"messages": msgs})
    last = result["messages"][-1]
    tool_used = None
    for m in reversed(result["messages"]):
        if hasattr(m, "name"):
            tool_used = m.name
            break
    return {
        "reply": last.content if hasattr(last, "content") else str(last),
        "tool_used": tool_used,
    }