import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, appendAssistantChunk, setStreaming } from "../store/chatSlice";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function ChatView({ hcpId }) {
  const dispatch = useDispatch();
  const { messages, loading, streaming } = useSelector((s) => s.chat);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    dispatch(addUserMessage(text));
    setInput("");
    dispatch(setStreaming(true));

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hcp_id: hcpId, message: text, history }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        dispatch(appendAssistantChunk(chunk));
      }
    } catch (err) {
      dispatch(appendAssistantChunk(`[ERROR: ${err.message}]`));
    } finally {
      dispatch(setStreaming(false));
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-10">
            Talk to AIVOA. Try:
            <div className="text-xs text-slate-400 mt-2 leading-6">
              "Log a visit where Dr. Sharma showed interest in our new cardiology
              drug"
              <br />
              "Summarize this HCP's history"
              <br />
              "Suggest my next best action"
              <br />
              "Edit interaction 3, change sentiment to Positive"
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[70%] px-3.5 py-2.5 rounded-xl mb-2.5 whitespace-pre-wrap ${
              m.role === "user"
                ? "ml-auto bg-indigo-500 text-white"
                : "bg-slate-700"
            }`}
          >
            {m.content}
            {m.tool_used && (
              <div className="text-[10px] text-cyan-400 mt-1">
                ⚙ tool: {m.tool_used}
              </div>
            )}
          </div>
        ))}
        {(loading || streaming) && (
          <div className="max-w-[70%] px-3.5 py-2.5 rounded-xl mb-2.5 bg-slate-700">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form
        className="flex gap-2 p-4 border-t border-slate-700"
        onSubmit={send}
      >
        <input
          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message to the AI agent…"
        />
        <button
          className="bg-indigo-500 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
          type="submit"
          disabled={loading || streaming}
        >
          Send
        </button>
      </form>
    </div>
  );
}