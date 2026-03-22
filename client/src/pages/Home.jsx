import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
  BsStars,
  BsArrowRight,
  BsCheckCircleFill,
  BsLightningChargeFill,
  BsGraphUpArrow,
  BsShieldCheck
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleProtectedRoute = (path) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    navigate(path);
  };

  const steps = [
    {
      icon: <BsRobot size={24} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "Choose job role and experience so the AI adjusts difficulty and question depth intelligently."
    },
    {
      icon: <BsMic size={24} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Practice with dynamic questioning, smart follow-ups, and realistic interview interaction."
    },
    {
      icon: <BsClock size={24} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Build confidence under pressure with time tracking just like a real interview environment."
    }
  ];

  const capabilities = [
    {
      image: evalImg,
      icon: <BsBarChart size={20} />,
      title: "AI Answer Evaluation",
      desc: "Get scored on confidence, communication, structure, and technical correctness."
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume Based Interview",
      desc: "Generate personalized questions from your projects, resume keywords, and experience."
    },
    {
      image: pdfImg,
      icon: <BsShieldCheck size={20} />,
      title: "Downloadable PDF Report",
      desc: "Access polished reports with strengths, weak areas, and practical improvement advice."
    },
    {
      image: analyticsImg,
      icon: <BsGraphUpArrow size={20} />,
      title: "History & Analytics",
      desc: "Track your journey with progress insights, weak-topic analysis, and score trends."
    }
  ];

  const modes = [
    {
      img: hrImg,
      title: "HR Interview Mode",
      desc: "Behavioral and situational questions to improve communication and professionalism."
    },
    {
      img: techImg,
      title: "Technical Mode",
      desc: "Role-based technical interviews with deeper follow-ups on concepts and projects."
    },
    {
      img: confidenceImg,
      title: "Confidence Detection",
      desc: "Analyze speaking flow, hesitation, and overall confidence during your answers."
    },
    {
      img: creditImg,
      title: "Credits System",
      desc: "Unlock premium interview sessions and advanced AI features in a simple way."
    }
  ];

  const miniFeatures = [
    {
      icon: <BsLightningChargeFill size={18} />,
      title: "Instant AI Feedback",
      desc: "See what to improve after every answer."
    },
    {
      icon: <BsGraphUpArrow size={18} />,
      title: "Performance Growth",
      desc: "Measure progress over multiple sessions."
    },
    {
      icon: <BsShieldCheck size={18} />,
      title: "Resume Aligned Practice",
      desc: "Train on questions that match your profile."
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 overflow-hidden">
      

      <main className="relative">
        <div className="absolute top-10 left-[-80px] h-72 w-72 rounded-full bg-green-200/30 blur-3xl"></div>
        <div className="absolute top-36 right-[-60px] h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lime-100/30 blur-3xl"></div>

        <section className="relative px-6 pt-10 pb-20 md:pt-14 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/70 px-4 py-2 text-sm text-gray-700 shadow-sm backdrop-blur-md"
                >
                  <HiSparkles className="text-green-600" size={16} />
                  Premium AI Mock Interview Platform
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
                >
                  Practice Interviews with{" "}
                  <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 bg-clip-text text-transparent">
                    AI Intelligence
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.9 }}
                  className="mt-6 max-w-2xl text-lg leading-8 text-gray-600"
                >
                  Role-based mock interviews with adaptive difficulty, smart
                  follow-ups, voice interaction, and real-time evaluation to help
                  you become interview-ready with confidence.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="mt-10 flex flex-wrap gap-4"
                >
                  <button
                    onClick={() => handleProtectedRoute("/interview")}
                    className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg shadow-green-200 transition hover:scale-[1.02]"
                  >
                    Start Interview
                    <BsArrowRight className="transition group-hover:translate-x-1" />
                  </button>

                  <button
                    onClick={() => handleProtectedRoute("/history")}
                    className="rounded-2xl border border-gray-200 bg-white/90 px-8 py-4 font-medium text-gray-700 shadow-sm backdrop-blur-md transition hover:border-green-400 hover:text-green-600"
                  >
                    View History
                  </button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.1 }}
                  className="mt-8 flex flex-wrap gap-5"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BsCheckCircleFill className="text-green-500" />
                    Real-time AI analysis
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BsCheckCircleFill className="text-green-500" />
                    Resume-based questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BsCheckCircleFill className="text-green-500" />
                    HR + Technical modes
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="mt-10 grid max-w-xl grid-cols-3 gap-4"
                >
                  <div className="rounded-2xl border border-white bg-white/80 px-5 py-4 text-center shadow-sm backdrop-blur-md">
                    <div className="text-2xl font-bold">10K+</div>
                    <div className="mt-1 text-sm text-gray-500">Sessions</div>
                  </div>
                  <div className="rounded-2xl border border-white bg-white/80 px-5 py-4 text-center shadow-sm backdrop-blur-md">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="mt-1 text-sm text-gray-500">Satisfaction</div>
                  </div>
                  <div className="rounded-2xl border border-white bg-white/80 px-5 py-4 text-center shadow-sm backdrop-blur-md">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="mt-1 text-sm text-gray-500">Available</div>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-200/50 blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-emerald-100/60 blur-2xl"></div>

                <div className="relative rounded-[32px] border border-white/70 bg-white/70 p-6 shadow-2xl shadow-gray-200 backdrop-blur-xl md:p-7">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Live AI Interview</p>
                      <h3 className="text-xl font-semibold">Interview Preview</h3>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-sm font-medium text-green-600">
                      <BsStars />
                      AI Active
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <p className="mb-2 text-xs font-semibold text-gray-500">
                        INTERVIEWER
                      </p>
                      <p className="leading-7 text-gray-800">
                        Tell me about a challenging project you worked on and how
                        you improved performance or scalability.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                      <p className="mb-2 text-xs font-semibold text-green-700">
                        AI ANALYSIS
                      </p>
                      <p className="leading-7 text-gray-700">
                        Strong ownership and clarity. Add more metrics, deeper
                        technical explanation, and final business impact.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                        <div className="text-xl font-bold">8.9</div>
                        <div className="mt-1 text-xs text-gray-500">Confidence</div>
                      </div>
                      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                        <div className="text-xl font-bold">9.1</div>
                        <div className="mt-1 text-xs text-gray-500">Clarity</div>
                      </div>
                      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
                        <div className="text-xl font-bold">8.7</div>
                        <div className="mt-1 text-xs text-gray-500">Technical</div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gray-950 p-5 text-white">
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-medium">Voice Activity</p>
                        <p className="text-xs text-green-400">Listening...</p>
                      </div>

                      <div className="flex h-16 items-end gap-2">
                        {[30, 55, 42, 75, 48, 70, 38, 82, 44, 68, 50, 74].map(
                          (h, i) => (
                            <motion.div
                              key={i}
                              initial={{ height: 10 }}
                              animate={{ height: h }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatType: "reverse",
                                delay: i * 0.08
                              }}
                              className="flex-1 rounded-full bg-gradient-to-t from-green-400 to-emerald-300"
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 md:grid-cols-3">
              {miniFeatures.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="rounded-3xl border border-white bg-white/80 p-6 shadow-sm backdrop-blur-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16 text-center text-3xl font-bold md:text-4xl"
            >
              How It <span className="text-green-600">Works</span>
            </motion.h2>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 34 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    {item.icon}
                  </div>
                  <div className="mb-2 text-xs font-semibold tracking-wider text-green-600">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-7 text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16 text-center text-3xl font-bold md:text-4xl"
            >
              Advanced AI <span className="text-green-600">Capabilities</span>
            </motion.h2>

            <div className="grid gap-8 md:grid-cols-2">
              {capabilities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                  className="rounded-[28px] border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-xl md:p-8"
                >
                  <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex w-full justify-center md:w-1/2">
                      <div className="flex w-full justify-center rounded-3xl bg-gray-50 p-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-64 w-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-1/2">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                        {item.icon}
                      </div>
                      <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
                      <p className="text-sm leading-7 text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16 text-center text-3xl font-bold md:text-4xl"
            >
              Multiple Interview <span className="text-green-600">Modes</span>
            </motion.h2>

            <div className="grid gap-8 md:grid-cols-2">
              {modes.map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="rounded-[28px] border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-xl"
                >
                  <div className="flex items-center justify-between gap-6">
                    <div className="w-1/2">
                      <h3 className="mb-3 text-xl font-semibold">{mode.title}</h3>
                      <p className="text-sm leading-7 text-gray-600">
                        {mode.desc}
                      </p>
                    </div>

                    <div className="flex w-1/2 justify-end">
                      <div className="rounded-3xl bg-gray-50 p-4">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="h-28 w-28 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  whileHover={{ scale: 1.03 }}
  onClick={() => navigate("/resume-analyser")}
  className="cursor-pointer bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all max-w-4xl mx-auto mb-32"
>
  <div className="flex flex-col md:flex-row items-center gap-8">

    {/* LEFT IMAGE */}
    <div className="w-full md:w-1/2 flex justify-center">
      <img
        src={resumeImg}
        alt="Resume Analyzer"
        className="w-full max-h-64 object-contain"
      />
    </div>

    {/* RIGHT CONTENT */}
    <div className="w-full md:w-1/2">
      <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
        <BsFileEarmarkText size={20} />
      </div>

      <h3 className="font-semibold mb-3 text-2xl">
        AI Resume Analyzer
      </h3>

      <p className="text-gray-500 text-sm leading-relaxed mb-4">
        Upload your resume and get instant feedback, ATS score,
        missing skills, and job matching insights.
      </p>

      <button className="bg-black text-white px-6 py-2 rounded-full">
        Try Now →
      </button>
    </div>
  </div>
</motion.div>
        
      </main>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
        
    </div>
  );
}

export default Home;