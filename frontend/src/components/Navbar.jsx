import React, { useState } from "react";
import { FaHome, FaUser, FaComments, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ currentPage, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: FaHome },
    { id: "crm", label: "CRM", icon: FaComments },
    { id: "contact", label: "Contact", icon: FaUser },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-bold text-xl">
            AIVOA<span className="text-cyan-400"> CRM</span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === item.id
                    ? "bg-indigo-500 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-slate-300 text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  currentPage === item.id
                    ? "bg-indigo-500 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}