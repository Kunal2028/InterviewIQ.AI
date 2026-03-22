import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/videos/male-ai.mp4";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { ServerUrl } from "../App";
import { BsArrowRight } from "react-icons/bs";
import Editor from "@monaco-editor/react";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions = [], userName = "Candidate" } = interviewData || {};

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];
  const isCodingQuestion = currentQuestion?.type === "coding";

  const getStarterCode = (lang) => {
    if (lang === "cpp") {
      return `#include <bits/stdc++.h>
using namespace std;

int main() {
    
    return 0;
}`;
    }

    if (lang === "java") {
      return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        
    }
}`;
    }

    if (lang === "python") {
      return `def solve():
    pass

if __name__ == "__main__":
    solve()`;
    }

    return `function solve() {
    
}

solve();`;
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  const startMic = () => {
    if (!recognitionRef.current) return;
    if (isAIPlaying) return;
    if (isCodingQuestion) return;
    if (!isMicOn) return;
    if (hasSubmitted) return;

    try {
      recognitionRef.current.start();
    } catch {}
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice || !text) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
        setIsAIPlaying(false);

        if (isMicOn && !isCodingQuestion && !hasSubmitted) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      if (voices[0]) {
        setSelectedVoice(voices[0]);
        setVoiceGender("female");
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => (prev + " " + transcript).trim());
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    if (!selectedVoice || !currentQuestion) return;

    const runInterviewSpeech = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false);
      } else {
        await new Promise((r) => setTimeout(r, 700));

        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isCodingQuestion) {
          stopMic();
        } else if (isMicOn && !hasSubmitted) {
          startMic();
        }
      }
    };

    runInterviewSpeech();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex, isIntroPhase]);

  useEffect(() => {
    if (!currentQuestion) return;

    setHasSubmitted(false);
    setFeedback("");
    setAnswer("");

    if (currentQuestion.type === "coding") {
      setCode(getStarterCode(language));
      stopMic();
    } else {
      setCode("");
      if (!isAIPlaying && isMicOn && !isIntroPhase) {
        startMic();
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.type !== "coding") return;

    setCode(getStarterCode(language));
  }, [language]);

  useEffect(() => {
    if (isCodingQuestion) {
      stopMic();
    } else if (!isAIPlaying && isMicOn && !feedback && !isIntroPhase && !hasSubmitted) {
      startMic();
    }
  }, [currentIndex, isCodingQuestion, isAIPlaying, isMicOn, feedback, isIntroPhase, hasSubmitted]);

  const toggleMic = () => {
    if (isCodingQuestion) return;

    if (isMicOn) {
      stopMic();
      setIsMicOn(false);
    } else {
      setIsMicOn(true);
      startMic();
    }
  };

  const submitAnswer = async () => {
    if (isSubmitting || !currentQuestion || hasSubmitted) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer: answer.trim(),
          code: code.trim(),
          language,
          timeTaken: (currentQuestion.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true }
      );

      const fb = result?.data?.feedback || "Answer submitted successfully.";
      setFeedback(fb);
      setHasSubmitted(true);

      await speakText(fb);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (isSubmitting || !currentQuestion || hasSubmitted) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer: "",
          code: "",
          language,
          timeTaken: (currentQuestion.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true }
      );

      const fb = result?.data?.feedback || "Question skipped.";
      setFeedback(fb);
      setHasSubmitted(true);

      await speakText(fb);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Skip failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (isSubmitting) return;

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");
    setCurrentIndex((prev) => prev + 1);
  };

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true }
      );

      onFinish(result.data);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to finish interview.");
    }
  };

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (timeLeft !== 0) return;
    if (isSubmitting) return;
    if (hasSubmitted) return;

    submitAnswer();
  }, [timeLeft, isIntroPhase, currentQuestion, isSubmitting, hasSubmitted]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch {}
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1400px] min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Interview Status</span>
              {isAIPlaying && (
                <span className="text-sm font-semibold text-emerald-600">
                  AI Speaking
                </span>
              )}
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit}
              />
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-600">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400">Current Question</span>
              </div>

              <div className="flex flex-col">
                <span className="text-2xl font-bold text-emerald-600">
                  {questions.length}
                </span>
                <span className="text-xs text-gray-400">Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

          {!isIntroPhase && currentQuestion && (
            <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                Question {currentIndex + 1} of {questions.length}
              </p>

              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold capitalize">
                  {currentQuestion?.difficulty || "easy"}
                </span>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold capitalize">
                  {currentQuestion?.type || "theory"}
                </span>

                {currentQuestion?.topic && (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold capitalize">
                    {currentQuestion.topic}
                  </span>
                )}
              </div>

              <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </div>
            </div>
          )}

          {isCodingQuestion ? (
            <div className="flex-1 flex flex-col gap-3 min-h-[420px]">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-gray-500">
                  Coding Question — Write your solution below
                </p>

                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white outline-none"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
            </div>
          ) : (
            <textarea
              placeholder="Type your answer here..."
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800 min-h-[320px]"
            />
          )}

          {!feedback ? (
            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                disabled={isCodingQuestion}
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full shadow-lg ${
                  isCodingQuestion
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white"
                }`}
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting || hasSubmitted}
                whileTap={{ scale: 0.95 }}
                className="flex-1 min-w-[180px] bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>

              <motion.button
                onClick={handleSkip}
                disabled={isSubmitting || hasSubmitted}
                whileTap={{ scale: 0.95 }}
                className="px-5 min-w-[120px] py-3 sm:py-4 rounded-2xl border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 font-medium mb-4">{feedback}</p>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                {currentIndex + 1 >= questions.length ? "Finish Interview" : "Next Question"}
                <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview; 