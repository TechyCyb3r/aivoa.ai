import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSpinner } from "react-icons/fa";
import { saveInteraction } from "../store/hcpSlice";

const inputCls =
  "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500";
const labelCls = "block text-sm text-slate-400 mt-3 mb-1";

export default function FormView({ hcpId }) {
  const dispatch = useDispatch();
  const { saving } = useSelector((s) => s.hcp);
  const [form, setForm] = useState({
    channel: "Visit",
    summary: "",
    sentiment: "Neutral",
    topics: "",
    products_discussed: "",
    next_best_action: "",
    raw_transcript: "",
  });
  const [saved, setSaved] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    dispatch(
      saveInteraction({
        hcp_id: hcpId,
        channel: form.channel,
        summary: form.summary,
        sentiment: form.sentiment,
        topics: form.topics,
        products_discussed: form.products_discussed,
        next_best_action: form.next_best_action,
        raw_transcript: form.raw_transcript,
      })
    ).then(() => {
      setSaved(true);
      setForm({
        channel: "Visit",
        summary: "",
        sentiment: "Neutral",
        topics: "",
        products_discussed: "",
        next_best_action: "",
        raw_transcript: "",
      });
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-4">
      <h3 className="mt-0 font-bold text-lg">Log Interaction (Structured Form)</h3>
      {saving && (
        <div className="flex items-center gap-2 text-cyan-400 text-sm mb-3">
          <FaSpinner className="animate-spin" size={16} />
          Saving...
        </div>
      )}
      <form onSubmit={submit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Channel</label>
            <select className={inputCls} value={form.channel} onChange={update("channel")}>
              <option>Visit</option>
              <option>Call</option>
              <option>Email</option>
              <option>Webinar</option>
              <option>Conference</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Sentiment</label>
            <select className={inputCls} value={form.sentiment} onChange={update("sentiment")}>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>
          </div>
        </div>

        <label className={labelCls}>Summary</label>
        <textarea
          rows={3}
          className={inputCls}
          value={form.summary}
          onChange={update("summary")}
          placeholder="What happened in this interaction?"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Topics (comma separated)</label>
            <input
              className={inputCls}
              value={form.topics}
              onChange={update("topics")}
              placeholder="Diabetes, Adherence"
            />
          </div>
          <div>
            <label className={labelCls}>Products Discussed</label>
            <input
              className={inputCls}
              value={form.products_discussed}
              onChange={update("products_discussed")}
              placeholder="Metformin XR"
            />
          </div>
        </div>

        <label className={labelCls}>Next Best Action</label>
        <input
          className={inputCls}
          value={form.next_best_action}
          onChange={update("next_best_action")}
          placeholder="Schedule follow-up in 2 weeks"
        />

        <label className={labelCls}>Raw Transcript / Notes (optional)</label>
        <textarea
          rows={2}
          className={inputCls}
          value={form.raw_transcript}
          onChange={update("raw_transcript")}
          placeholder="Verbatim notes from the conversation"
        />

        <div className="mt-4 flex gap-2 items-center">
          <button
            className="bg-indigo-500 text-white rounded-lg px-4 py-2 font-semibold disabled:opacity-50"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save Interaction"}
          </button>
          {saved && <span className="text-green-500">Saved ✓</span>}
        </div>
      </form>
    </div>
  );
}