import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHcps,
  addHcp,
  selectHcp,
  fetchInteractions,
} from "./store/hcpSlice";
import { resetChat } from "./store/chatSlice";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Sidebar from "./components/Sidebar";
import FormView from "./components/FormView";
import ChatView from "./components/ChatView";
import InteractionList from "./components/InteractionList";

export default function App() {
  const dispatch = useDispatch();
  const { list, selectedId, interactions, loading } = useSelector((s) => s.hcp);
  const [page, setPage] = useState("home");
  const [tab, setTab] = useState("form");
  const [showNewHcp, setShowNewHcp] = useState(false);
  const [hcpForm, setHcpForm] = useState({
    name: "",
    specialty: "",
    designation: "",
    hospital: "",
    city: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    dispatch(fetchHcps());
  }, [dispatch]);

  useEffect(() => {
    if (selectedId) {
      dispatch(fetchInteractions(selectedId));
      dispatch(resetChat());
    }
  }, [selectedId, dispatch]);

  const handleSelect = (id) => {
    dispatch(selectHcp(id));
    setTab("form");
  };

  const handleCreateHcp = (e) => {
    e.preventDefault();
    dispatch(addHcp(hcpForm)).then(() => {
      setShowNewHcp(false);
      setHcpForm({
        name: "",
        specialty: "",
        designation: "",
        hospital: "",
        city: "",
        email: "",
        phone: "",
      });
    });
  };

  const selected = list.find((h) => h.id === selectedId);

  const renderPage = () => {
    if (page === "home") {
      return <Home onNavigate={setPage} />;
    }
    if (page === "contact") {
      return <Contact />;
    }
    if (page === "crm") {
      return (
        <div className="grid grid-cols-[280px_1fr] h-[calc(100vh-64px)]">
          <Sidebar
            list={list}
            selectedId={selectedId}
            onSelect={handleSelect}
            onNew={() => setShowNewHcp(true)}
            loading={loading}
          />
          <div className="flex flex-col overflow-hidden">
            {!selectedId ? (
              <div className="m-auto text-slate-400 text-center">
                Select an HCP from the left, or create a new one to start logging
                interactions.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                  <div>
                    <div className="font-bold text-lg">
                      {selected.name}{" "}
                      <span className="text-xs text-slate-400">#{selected.id}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {selected.designation} {selected.specialty} · {selected.hospital}{" "}
                      · {selected.city}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        tab === "form"
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                      onClick={() => setTab("form")}
                    >
                      Structured Form
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        tab === "chat"
                          ? "bg-indigo-500 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                      onClick={() => setTab("chat")}
                    >
                      Conversational Chat
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  {tab === "form" ? (
                    <>
                      <FormView hcpId={selectedId} />
                      <InteractionList interactions={interactions} hcpId={selectedId} />
                    </>
                  ) : (
                    <ChatView hcpId={selectedId} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <Navbar currentPage={page} onNavigate={setPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />

      {showNewHcp && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowNewHcp(false)}
        >
          <div
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-[480px] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mt-0 font-bold text-lg">New HCP</h3>
            <form onSubmit={handleCreateHcp}>
              <label className="block text-sm text-slate-400 mt-3 mb-1">Name *</label>
              <input
                required
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                value={hcpForm.name}
                onChange={(e) => setHcpForm({ ...hcpForm, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mt-3 mb-1">Designation</label>
                  <input
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    value={hcpForm.designation}
                    onChange={(e) => setHcpForm({ ...hcpForm, designation: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mt-3 mb-1">Specialty</label>
                  <input
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    value={hcpForm.specialty}
                    onChange={(e) => setHcpForm({ ...hcpForm, specialty: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mt-3 mb-1">Hospital</label>
                  <input
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    value={hcpForm.hospital}
                    onChange={(e) => setHcpForm({ ...hcpForm, hospital: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mt-3 mb-1">City</label>
                  <input
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    value={hcpForm.city}
                    onChange={(e) => setHcpForm({ ...hcpForm, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mt-3 mb-1">Email</label>
                  <input
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    value={hcpForm.email}
                    onChange={(e) => setHcpForm({ ...hcpForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mt-3 mb-1">Phone</label>
                  <input
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
                    value={hcpForm.phone}
                    onChange={(e) => setHcpForm({ ...hcpForm, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button className="bg-indigo-500 text-white rounded-lg px-4 py-2 font-semibold" type="submit">
                  Create
                </button>
                <button
                  className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 font-semibold"
                  type="button"
                  onClick={() => setShowNewHcp(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}