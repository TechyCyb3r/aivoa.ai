import React from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Contact Me</h1>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Himanshu Agarwal</h2>
              <p className="text-slate-400 mb-6">
                Full-Stack Developer | AI/ML Enthusiast | Building AIVOA CRM
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-cyan-400 text-xl" />
                  <div>
                    <div className="text-sm text-slate-400">Email</div>
                    <a href="mailto:himanshu@aivoa.ai" className="hover:text-cyan-400">himanshu@aivoa.ai</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-cyan-400 text-xl" />
                  <div>
                    <div className="text-sm text-slate-400">Phone</div>
                    <a href="tel:+919876543210" className="hover:text-cyan-400">+91 98765 43210</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-cyan-400 text-xl" />
                  <div>
                    <div className="text-sm text-slate-400">Location</div>
                    <span>Sikar, Rajasthan, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="space-y-3">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white">
                  <FaGithub className="text-2xl" />
                  <span>github.com/himanshu</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white">
                  <FaLinkedin className="text-2xl" />
                  <span>linkedin.com/in/himanshu</span>
                </a>
                <a href="mailto:himanshu@aivoa.ai" className="flex items-center gap-3 text-slate-300 hover:text-white">
                  <FaEnvelope className="text-2xl" />
                  <span>himanshu@aivoa.ai</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}