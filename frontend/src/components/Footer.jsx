import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 px-6 py-8">
      {/* <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"> */}
      <div className="max-w-6xl mx-auto flex justify-center items-center">
        {/* Brand */}
        <div>
          <div className="font-bold text-xl mb-2 text-center">
            AIVOA<span className="text-cyan-400"> CRM</span>
          </div>
          <p className="text-sm text-slate-400">
            AI-First CRM for Healthcare Professionals. Built with LangGraph, Groq, and React.
          </p>
        </div>

        {/* Social */}
        {/* <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <div className="flex gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
              <FaGithub size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-slate-300 hover:text-white">
              <FaLinkedin size={20} />
            </a>
            <a href="mailto:himanshu@aivoa.ai" className="text-slate-300 hover:text-white">
              <FaEnvelope size={20} />
            </a>
          </div>
         </div> */}
      </div> 

      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-slate-700 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} AIVOA. All rights reserved.
      </div>
    </footer>
  );
}