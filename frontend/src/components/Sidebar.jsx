import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FaEdit, FaTrash, FaSpinner, FaTrashAlt } from "react-icons/fa";
import { deleteHcp, clearAll } from "../store/hcpSlice";

export default function Sidebar({ list, selectedId, onSelect, onNew, loading }) {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const startEdit = (h) => {
    setEditingId(h.id);
    setEditName(h.name);
  };

  const saveEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this HCP and all its interactions?")) return;
    setDeletingId(id);
    dispatch(deleteHcp(id)).finally(() => setDeletingId(null));
  };

  const handleClearAll = () => {
    if (!window.confirm("Delete ALL HCPs and interactions? This cannot be undone.")) return;
    dispatch(clearAll());
  };

  return (
    <div className="bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
      <div className="font-bold text-lg">
        AIVOA<span className="text-cyan-400"> CRM</span>
      </div>
      <div className="text-xs text-slate-400 mb-4">AI-First HCP Module</div>
      <button
        className="w-full bg-indigo-500 text-white rounded-lg px-4 py-2 font-semibold"
        onClick={onNew}
      >
        + New HCP
      </button>
      <div className="mt-4">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <FaSpinner className="animate-spin text-cyan-400" size={20} />
          </div>
        ) : list.length === 0 ? (
          <div className="text-xs text-slate-400">No HCPs yet. Create one to begin.</div>
        ) : (
          list.map((h) => (
            <div
              key={h.id}
              className={`p-3 rounded-lg mb-1.5 cursor-pointer border border-transparent ${
                h.id === selectedId ? "bg-slate-700 border-indigo-500" : "hover:bg-slate-700"
              }`}
              onClick={() => onSelect(h.id)}
            >
              {editingId === h.id ? (
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <button
                    className="text-xs bg-indigo-500 text-white px-2 py-1 rounded"
                    onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold flex-1">{h.name}</div>
                    <div className="flex gap-2 ml-2">
                      <button
                        className="text-slate-400 hover:text-white"
                        onClick={(e) => { e.stopPropagation(); startEdit(h); }}
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="text-red-400 hover:text-red-300"
                        onClick={(e) => { e.stopPropagation(); handleDelete(h.id); }}
                        disabled={deletingId === h.id}
                      >
                        {deletingId === h.id ? <FaSpinner size={16} className="animate-spin" /> : <FaTrash size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {h.specialty || "—"} · {h.city || ""}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      {list.length > 0 && (
        <button
          className="mt-4 w-full border border-red-500/40 text-red-400 rounded-lg px-4 py-2 font-semibold hover:bg-red-500/10 flex items-center justify-center gap-2"
          onClick={handleClearAll}
        >
          <FaTrashAlt size={14} />
          Clear All Data
        </button>
      )}
      </div>
    </div>
  );
}
