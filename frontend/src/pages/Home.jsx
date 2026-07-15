import React from "react";
import { FaRocket, FaBrain, FaShieldAlt, FaChartLine } from "react-icons/fa";

export default function Home({ onNavigate }) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          AIVOA <span className="text-cyan-400">CRM</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          AI-First Customer Relationship Management for Healthcare Professionals.
          Built with LangGraph, Groq, and React.
        </p>
        <button
          onClick={() => onNavigate("crm")}
          className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
        >
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <FaBrain className="text-4xl text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Chat</h3>
            <p className="text-sm text-slate-400">
              Log interactions naturally via conversational AI with LangGraph + Groq.
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <FaRocket className="text-4xl text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Tools</h3>
            <p className="text-sm text-slate-400">
              5 intelligent tools: log, edit, search, summarize, and suggest next actions.
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <FaChartLine className="text-4xl text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Insights</h3>
            <p className="text-sm text-slate-400">
              Get instant summaries and recommendations for better HCP engagement.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 max-w-3xl mx-auto">
          <FaShieldAlt className="text-5xl text-cyan-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to transform your HCP engagement?</h2>
          <p className="text-slate-400 mb-6">
            Start using AIVOA CRM today and experience the future of pharmaceutical field force.
          </p>
          <button
            onClick={() => onNavigate("crm")}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
          >
            Launch CRM
          </button>
        </div>
      </section>
    </div>
  );
}