# AIVOA — AI-First CRM (HCP Module)

A submission for the **Naukri Round 1 Assignment**: an AI-first Customer
Relationship Management system focused on the Healthcare Professional (HCP)
module, designed for pharmaceutical field representatives.

The core screen is the **Log Interaction Screen**, which lets a rep log an
interaction with an HCP either through a **structured form** or a
**conversational chat interface** powered by a **LangGraph** agent and a
**Groq LLM**.

---

## Tech Stack

| Layer        | Technology                                              |
|--------------|---------------------------------------------------------|
| Frontend     | React 18 + Vite, Redux Toolkit (state management)       |
| Backend      | Python + FastAPI                                        |
| AI Agent     | LangGraph (mandatory)                                   |
| LLM          | Groq `gemma2-9b-it` (optionally `llama-3.3-70b-versatile`) |
| Database     | PostgreSQL (MySQL also supported via URL change)        |
| Font         | Google Inter                                            |

---

## Project Structure

```
.
├── backend/                 # FastAPI + LangGraph agent
│   ├── app/
│   │   ├── agent.py         # LangGraph agent + 5 tools
│   │   ├── main.py          # FastAPI app entrypoint
│   │   ├── models.py        # SQLAlchemy models (HCP, Interaction)
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── database.py      # DB engine / session
│   │   ├── config.py        # Settings (Groq key, DB URL)
│   │   └── routers/         # hcp, interaction, chat routers
│   ├── requirements.txt
│   └── .env.example
└── frontend/                # React + Redux (Vite)
    └── src/
        ├── store/           # Redux slices + API client
        └── components/      # Sidebar, FormView, ChatView, InteractionList
```

---

## LangGraph Agent & Tools

The LangGraph agent acts as an intelligent field-rep co-pilot. It manages the
conversation, decides which tool to call based on the rep's natural-language
message, and orchestrates structured persistence of HCP interactions. It uses
Groq's `gemma2-9b-it` for reasoning, summarization and entity extraction.

**Five tools (2 mandatory + 3 sales-related):**

1. **`log_interaction`** *(mandatory)* — Captures interaction data. Uses the LLM
   to summarize free-text, extract sentiment, topics, products discussed and a
   next best action, then persists to the database.
2. **`edit_interaction`** *(mandatory)* — Modifies a previously logged
   interaction (channel, summary, sentiment, topics, products, next action).
3. **`search_hcp`** — Finds HCPs by name / specialty / city.
4. **`summarize_history`** — Produces an LLM briefing of an HCP's past
   interactions.
5. **`suggest_next_action`** — Recommends the rep's next best action based on
   HCP profile + history.

---

## How to Run

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Create your .env from the example and add your Groq key
cp .env.example .env
# edit .env -> set GROQ_API_KEY and DATABASE_URL

# Ensure Postgres is running and the DB exists, then:
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

The frontend expects the backend at `http://localhost:8000` (override with
`VITE_API_URL` in `frontend/.env`).
---