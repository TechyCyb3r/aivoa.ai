import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaSave, FaTimes, FaSpinner } from "react-icons/fa";
import { editInteraction } from "../store/hcpSlice";

const inputCls =
  "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500";
const labelCls = "block text-sm text-slate-400 mt-3 mb-1";

export default function InteractionList({ interactions, hcpId }) {
  const dispatch = useDispatch();
  const { saving } = useSelector((s) => s.hcp);
  const [editingId, setEditingId] = useState(null);
  const [editField, setEditField] = useState("summary");
  const [editValue, setEditValue] = useState("");

  const startEdit = (interaction) => {
    setEditingId(interaction.id);
    setEditField("summary");
    setEditValue(interaction.summary || "");
  };

  const submitEdit = (id) => {
    setEditingId(null);
    dispatch(editInteraction({ id, data: { [editField]: editValue } }));
  };

  if (!interactions || interactions.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
        <h3 className="mt-0 font-bold text-lg">Logged Interactions</h3>
        <div className="text-xs text-slate-400">No interactions logged yet.</div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
      <h3 className="mt-0 font-bold text-lg">
        Logged Interactions ({interactions.length})
      </h3>
      {saving && (
        <div className="flex items-center gap-2 text-cyan-400 text-sm mb-3">
          <FaSpinner className="animate-spin" size={16} />
          Updating...
        </div>
      )}
      {interactions.map((it) => {
        const sentClass =
          it.sentiment === "Positive"
            ? "bg-green-500/15 text-green-500"
            : it.sentiment === "Negative"
            ? "bg-red-500/15 text-red-500"
            : "bg-slate-700 text-slate-400";
        return (
          <div
            key={it.id}
            className="border-l-4 border-indigo-500 pl-3 mb-3.5"
          >
            <div>
              <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 mr-1.5">
                {it.channel}
              </span>
              <span
                className={`inline-block text-[11px] px-2 py-0.5 rounded-full mr-1.5 ${sentClass}`}
              >
                {it.sentiment}
              </span>
              <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 mr-1.5">
                #{it.id}
              </span>
            </div>
            <div className="mt-1.5">{it.summary}</div>
            {it.topics && (
              <div className="text-xs text-slate-400 mt-1">Topics: {it.topics}</div>
            )}
            {it.products_discussed && (
              <div className="text-xs text-slate-400">
                Products: {it.products_discussed}
              </div>
            )}
            {it.next_best_action && (
              <div className="text-xs text-slate-400">
                Next: {it.next_best_action}
              </div>
            )}

            {editingId === it.id ? (
              <div className="mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Field</label>
                    <select
                      className={inputCls}
                      value={editField}
                      onChange={(e) => setEditField(e.target.value)}
                    >
                      <option value="summary">summary</option>
                      <option value="sentiment">sentiment</option>
                      <option value="topics">topics</option>
                      <option value="channel">channel</option>
                      <option value="products_discussed">products_discussed</option>
                      <option value="next_best_action">next_best_action</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>New Value</label>
                    <input
                      className={inputCls}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    className="bg-indigo-500 text-white rounded-lg px-4 py-2 font-semibold"
                    onClick={() => submitEdit(it.id)}
                  >
                    <FaSave size={16} />
                  </button>
                  <button
                    className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 font-semibold"
                    onClick={() => setEditingId(null)}
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 font-semibold mt-2"
                onClick={() => startEdit(it)}
              >
                <FaEdit size={16} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
} 