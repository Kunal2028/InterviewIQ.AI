import React from "react";
import { HiSparkles } from "react-icons/hi";
import { BsGithub, BsLinkedin, BsTwitterX } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative mt-20 border-t border-white/30 bg-gradient-to-b from-[#f8fafc] to-[#edfdf4]">
      <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-green-200/30 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <HiSparkles size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">InterviewAI</h2>
                <p className="text-sm text-gray-500">
                  Practice smarter. Perform better.
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-600">
              A premium AI interview preparation platform for role-based mock
              interviews, smart follow-ups, resume-driven practice, and real-time
              performance evaluation.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-gray-600">
              <button onClick={() => navigate("/")} className="text-left hover:text-green-600 transition">
                Home
              </button>
              <button onClick={() => navigate("/interview")} className="text-left hover:text-green-600 transition">
                Start Interview
              </button>
              <button onClick={() => navigate("/history")} className="text-left hover:text-green-600 transition">
                Performance History
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              Connect
            </h3>
            <p className="mt-5 text-sm text-gray-600 leading-7">
              Build your interview confidence with a cleaner, smarter, AI-powered
              practice experience.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-green-400 hover:text-green-600"
              >
                <BsGithub size={18} />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-green-400 hover:text-green-600"
              >
                <BsLinkedin size={18} />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-green-400 hover:text-green-600"
              >
                <BsTwitterX size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-gray-200 pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 InterviewAI. All rights reserved.</p>
          <p className="font-medium text-gray-700">Created by Kunal Upadhyay</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;