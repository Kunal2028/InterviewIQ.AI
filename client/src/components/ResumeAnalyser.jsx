import React, { useState } from "react";
import { motion } from "motion/react";
import {
  HiSparkles,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowUpTray,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineLightBulb,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

function ResumeAnalyser() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = "http://localhost:8000";

  const handleAnalyze = async () => {
    if (!file) {
      alert("Upload resume first");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch(`${API}/api/resume/analyze`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Analysis failed");
      }

      setAnalysis(data.data);
    } catch (err) {
      console.error(err);
      alert(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.10),_transparent_35%),linear-gradient(to_bottom,_#f8fffb,_#f3f4f6)] px-4 py-12 md:px-6">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            <HiSparkles className="text-base" />
            AI-powered resume review
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Resume <span className="text-green-600">Analyzer</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            Upload your resume and get ATS insights, strengths, weaknesses, and
            practical improvement suggestions in a cleaner premium dashboard.
          </p>
        </motion.div>

        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
                <HiOutlineDocumentText className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                  Upload Resume
                </h2>
                <p className="text-sm text-gray-500">
                  Submit your resume for instant AI analysis.
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-dashed border-gray-300 bg-gradient-to-b from-gray-50 to-white p-6 text-center transition hover:border-green-400 hover:bg-green-50/30 md:p-8">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                id="resumeUpload"
              />

              <label
                htmlFor="resumeUpload"
                className="mx-auto flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm ring-1 ring-gray-100">
                  <HiOutlineArrowUpTray className="text-3xl" />
                </div>

                <div>
                  <p className="text-base font-semibold text-gray-800 md:text-lg">
                    {file ? file.name : "Click to upload your resume"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Supports PDF, DOC, and DOCX
                  </p>
                </div>
              </label>

              {file && (
                <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
                  <HiOutlineClipboardDocumentCheck className="text-base" />
                  File selected successfully
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-100 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HiSparkles className="text-base" />
                Analyze Resume
              </button>
            </div>

            {loading && (
              <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-center text-sm font-medium text-green-700">
                Analyzing your resume. This may take a few seconds...
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl md:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-lg">
                <HiOutlineChartBar className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                  Smart Insights
                </h2>
                <p className="text-sm text-gray-500">
                  Your AI review appears here after analysis.
                </p>
              </div>
            </div>

            {!analysis && !loading && (
              <div className="flex min-h-[340px] flex-col items-center justify-center rounded-[28px] border border-dashed border-gray-200 bg-gray-50/70 px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-green-600 shadow-sm ring-1 ring-gray-100">
                  <HiSparkles className="text-3xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  No analysis yet
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Upload your resume and start the AI review to see ATS score,
                  summary, strengths, weaknesses, and improvements.
                </p>
              </div>
            )}

            {analysis && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] bg-gray-950 p-6 text-white shadow-lg">
                    <p className="text-sm text-gray-300">Overall Score</p>
                    <p
                      className={`mt-3 text-5xl font-bold ${scoreColor(
                        analysis.overall_score ?? 0
                      )}`}
                    >
                      {analysis.overall_score ?? 0}
                    </p>
                  </div>

                  <div className="rounded-[28px] bg-white p-6 shadow-md ring-1 ring-gray-100">
                    <p className="text-sm text-gray-500">ATS Score</p>
                    <p
                      className={`mt-3 text-5xl font-bold ${scoreColor(
                        analysis.ats_score ?? 0
                      )}`}
                    >
                      {analysis.ats_score ?? 0}
                    </p>
                  </div>
                </div>

                <div className="rounded-[28px] bg-gradient-to-r from-gray-50 to-green-50 p-6 ring-1 ring-gray-100">
                  <div className="mb-3 flex items-center gap-2">
                    <HiSparkles className="text-lg text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI Summary
                    </h3>
                  </div>
                  <p className="leading-7 text-gray-600">{analysis.summary}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[28px] bg-emerald-50 p-5 ring-1 ring-emerald-100">
                    <div className="mb-3 flex items-center gap-2">
                      <HiOutlineShieldCheck className="text-lg text-emerald-600" />
                      <h4 className="font-semibold text-emerald-700">
                        Strengths
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-gray-700">
                      {analysis.strengths?.length ? (
                        analysis.strengths.map((s, i) => <p key={i}>• {s}</p>)
                      ) : (
                        <p>No strengths found</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-red-50 p-5 ring-1 ring-red-100">
                    <div className="mb-3 flex items-center gap-2">
                      <HiOutlineExclamationTriangle className="text-lg text-red-600" />
                      <h4 className="font-semibold text-red-700">
                        Weaknesses
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-gray-700">
                      {analysis.weaknesses?.length ? (
                        analysis.weaknesses.map((w, i) => <p key={i}>• {w}</p>)
                      ) : (
                        <p>No weaknesses found</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-amber-50 p-5 ring-1 ring-amber-100">
                    <div className="mb-3 flex items-center gap-2">
                      <HiOutlineLightBulb className="text-lg text-amber-600" />
                      <h4 className="font-semibold text-amber-700">
                        Improvements
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm leading-6 text-gray-700">
                      {analysis.improvements?.length ? (
                        analysis.improvements.map((imp, i) => (
                          <p key={i}>• {imp}</p>
                        ))
                      ) : (
                        <p>No improvements found</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] bg-violet-50 p-5 ring-1 ring-violet-100">
                  <h4 className="mb-3 font-semibold text-violet-700">
                    Missing Keywords
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords_missing?.length ? (
                      analysis.keywords_missing.map((k, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-violet-200"
                        >
                          {k}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">
                        No missing keywords found
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyser;