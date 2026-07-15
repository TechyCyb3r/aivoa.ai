from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app import schemas
from app.agent import run_agent
from langchain_groq import ChatGroq
from app.config import settings

router = APIRouter(prefix="/chat", tags=["Agent Chat"])

# Direct LLM for simple messages (saves tokens vs full LangGraph agent)
_direct_llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=settings.groq_api_key,
    temperature=0.2,
)


def _is_simple_message(message: str) -> bool:
    """Heuristic: if message doesn't ask for logging/editing/searching/summarizing,
    treat it as simple chat to save tokens."""
    keywords = ["log", "edit", "search", "find", "summarize", "suggest", "next action", "history", "interaction"]
    msg_lower = message.lower()
    return not any(k in msg_lower for k in keywords)


@router.post("", response_model=schemas.ChatResponse)
def chat(payload: schemas.ChatRequest):
    """Conversational interface to the LangGraph agent."""
    try:
        # Use direct LLM for simple messages to save tokens
        if _is_simple_message(payload.message):
            from langchain_core.messages import HumanMessage, SystemMessage
            msgs = [
                SystemMessage(content=(
                    "You are AIVOA. Be concise and professional."
                )),
                HumanMessage(content=f"[HCP id={payload.hcp_id}] {payload.message}"),
            ]
            resp = _direct_llm.invoke(msgs)
            return schemas.ChatResponse(reply=resp.content, tool_used=None)
        
        # Use full LangGraph agent for complex tasks
        result = run_agent(payload.hcp_id, payload.message, payload.history)
    except Exception as e:
        msg = str(e)
        if "Rate limit" in msg or "rate_limit_exceeded" in msg:
            reply = (
                "AI service rate limit reached. Please wait ~4 minutes and retry, "
                "or upgrade your Groq plan for higher limits."
            )
        else:
            reply = (
                "I'm temporarily unable to reach the AI service. "
                "Please try again in a moment."
            )
        return schemas.ChatResponse(reply=reply, tool_used=None)
    return schemas.ChatResponse(
        reply=result["reply"], tool_used=result["tool_used"]
    )


@router.post("/stream")
async def chat_stream(payload: schemas.ChatRequest):
    """Streaming chat endpoint using Groq native streaming."""
    from groq import Groq
    import json

    client = Groq(api_key=settings.groq_api_key)

    # Build messages for Groq
    messages = [
        {
            "role": "system",
            "content": (
                "You are AIVOA. Be concise and professional."
            ),
        }
    ]
    for h in (payload.history or []):
        role = h.get("role")
        content = h.get("content", "")
        if role in ("user", "assistant"):
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": f"[HCP id={payload.hcp_id}] {payload.message}"})

    async def generate():
        try:
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.2,
                max_completion_tokens=1024,
                top_p=1,
                stream=True,
                stop=None,
            )
            for chunk in completion:
                delta = chunk.choices[0].delta.content or ""
                if delta:
                    yield delta
        except Exception as e:
            msg = str(e)
            if "Rate limit" in msg or "rate_limit_exceeded" in msg:
                yield "AI service rate limit reached. Please wait ~4 minutes and retry, or upgrade your Groq plan for higher limits."
            else:
                yield f"[ERROR: {msg}]"

    return StreamingResponse(generate(), media_type="text/plain")