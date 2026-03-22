import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

const QUESTION_DIFFICULTY = ["easy", "easy", "medium", "medium", "hard"];
const QUESTION_TIME_LIMIT = [60, 60, 90, 90, 120];

const cleanText = (text = "") => {
  return text.replace(/\s+/g, " ").trim();
};

const safeJsonParse = (text = "") => {
  try {
    const cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
};

const normalizeQuestion = (text = "") => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const isSimilarQuestion = (a = "", b = "") => {
  const x = normalizeQuestion(a);
  const y = normalizeQuestion(b);

  if (!x || !y) return false;
  if (x === y) return true;
  if (x.includes(y) || y.includes(x)) return true;

  const xWords = new Set(x.split(" "));
  const yWords = new Set(y.split(" "));

  let common = 0;
  for (const word of xWords) {
    if (yWords.has(word)) common++;
  }

  const overlap = common / Math.max(xWords.size, yWords.size);
  return overlap >= 0.7;
};

const calculateStats = (questions = []) => {
  if (!questions.length) {
    return {
      finalScore: 0,
      confidence: 0,
      communication: 0,
      correctness: 0,
    };
  }

  let totalScore = 0;
  let totalConfidence = 0;
  let totalCommunication = 0;
  let totalCorrectness = 0;

  for (const q of questions) {
    totalScore += Number(q.score || 0);
    totalConfidence += Number(q.confidence || 0);
    totalCommunication += Number(q.communication || 0);
    totalCorrectness += Number(q.correctness || 0);
  }

  return {
    finalScore: Number((totalScore / questions.length).toFixed(1)),
    confidence: Number((totalConfidence / questions.length).toFixed(1)),
    communication: Number((totalCommunication / questions.length).toFixed(1)),
    correctness: Number((totalCorrectness / questions.length).toFixed(1)),
  };
};

const hasDsaSkill = (skills = [], resumeText = "") => {
  const text = [...skills, resumeText]
    .join(" ")
    .toLowerCase();

  const keywords = [
    "dsa",
    "data structures",
    "algorithms",
    "problem solving",
    "competitive programming",
    "leetcode",
    "codeforces",
    "c++",
    "java"
  ];

  return keywords.some((word) => text.includes(word));
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = cleanText(resumeText);

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.

Return ONLY valid JSON in this exact format:
{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}

Rules:
- Infer role if possible
- Keep empty string or empty array if missing
- No markdown
- No explanation
`
      },
      {
        role: "user",
        content: resumeText
      }
    ];

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    try {
      fs.unlinkSync(filepath);
    } catch {}

    if (!parsed) {
      return res.status(500).json({
        message: "AI returned invalid JSON while analyzing resume."
      });
    }

    return res.json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      resumeText
    });
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = cleanText(role || "");
    experience = cleanText(experience || "");
    mode = cleanText(mode || "");
    resumeText = cleanText(resumeText || "None");

    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "Role, Experience and Mode are required."
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    if ((user.credits || 0) < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required."
      });
    }

    const safeProjects = Array.isArray(projects) ? projects.filter(Boolean) : [];
    const safeSkills = Array.isArray(skills) ? skills.filter(Boolean) : [];
    const dsaPresent = hasDsaSkill(safeSkills, resumeText);

    const messages = [
      {
        role: "system",
        content: `
You are a FAANG-level interviewer.

Generate exactly 5 HIGH-QUALITY interview questions.

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No explanation
- Questions must be based on role, experience, interview mode, resume skills, projects, and resume text
- At least 3 questions must come directly from candidate skills or projects
- At least 2 questions must be scenario-based or project-based
- Avoid generic questions like "What is React?" unless absolutely necessary
- Questions must not repeat in meaning
- Difficulty order must be: easy, easy, medium, medium, hard

VERY IMPORTANT:
- If DSA / Algorithms / Data Structures / C++ / Java / LeetCode / Codeforces is present, include at least ONE coding question
- If React/frontend skills are present, include at least one frontend question
- If Node / Express / JWT / backend skills are present, include at least one backend question
- If MongoDB / SQL / DBMS is present, include at least one database question
- If projects are present, include at least one project-based question

if generating coding question:
- It must be a complete problem statement
- Include clear input/output expectation
- Should be solvable like a LeetCode problem
- Give The Question That Recently faang companies most asking

Return JSON in this exact format:
{
  "questions": [
    {
      "question": "string",
      "difficulty": "easy|medium|hard",
      "type": "theory|coding",
      "topic": "string"
    }
  ]
}
`
      },
      {
        role: "user",
        content: JSON.stringify({
          role,
          experience,
          mode,
          projects: safeProjects,
          skills: safeSkills,
          resumeText,
          dsaPresent
        })
      }
    ];

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    if (!parsed || !Array.isArray(parsed.questions)) {
      return res.status(500).json({
        message: "Invalid AI response"
      });
    }

    const questions = parsed.questions
      .filter((q) => q && q.question)
      .slice(0, 5);

    if (questions.length !== 5) {
      return res.status(500).json({
        message: "AI did not return 5 questions"
      });
    }

    const unique = [];
    for (const q of questions) {
      const exists = unique.some((u) => isSimilarQuestion(u.question, q.question));
      if (!exists) unique.push(q);
    }

    if (unique.length !== 5) {
      return res.status(500).json({
        message: "Duplicate questions detected. Retry."
      });
    }

    if (dsaPresent) {
      const hasCoding = unique.some((q) => q.type === "coding");
      if (!hasCoding) {
        return res.status(500).json({
          message: "DSA found in resume but coding question was not generated. Retry."
        });
      }
    }

    user.credits -= 50;
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText,
      questions: unique.map((q, index) => ({
        question: cleanText(q.question),
        difficulty: q.difficulty || QUESTION_DIFFICULTY[index],
        timeLimit: QUESTION_TIME_LIMIT[index],
        type: q.type || "theory",
        topic: q.topic || "general",
        answer: "",
        feedback: "",
        score: 0,
        confidence: 0,
        communication: 0,
        correctness: 0,
        code: "",
        language: "cpp"
      }))
    });

    return res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: `failed to create interview ${error.message}`
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken, code, language } = req.body;

    if (!interviewId || questionIndex === undefined) {
      return res.status(400).json({
        message: "Interview ID and question index are required."
      });
    }

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.userId
    });

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found."
      });
    }

    if (
      questionIndex < 0 ||
      questionIndex >= interview.questions.length ||
      !interview.questions[questionIndex]
    ) {
      return res.status(400).json({
        message: "Invalid question index."
      });
    }

    const question = interview.questions[questionIndex];
    const trimmedAnswer = cleanText(answer || "");
    const trimmedCode = (code || "").trim();

    if (question.type === "coding") {
      if (!trimmedCode) {
        question.score = 0;
        question.feedback = "You did not submit code.";
        question.answer = "";
        question.code = "";
        question.language = language || "cpp";

        await interview.save();

        return res.json({
          feedback: question.feedback,
          score: 0,
          confidence: 0,
          communication: 0,
          correctness: 0
        });
      }
    } else {
      if (!trimmedAnswer) {
        question.score = 0;
        question.feedback = "You did not submit an answer.";
        question.answer = "";

        await interview.save();

        return res.json({
          feedback: question.feedback,
          score: 0,
          confidence: 0,
          communication: 0,
          correctness: 0
        });
      }
    }

    if ((timeTaken || 0) > (question.timeLimit || 60)) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = trimmedAnswer;
      question.code = trimmedCode;
      question.language = language || "cpp";

      await interview.save();

      return res.json({
        feedback: question.feedback,
        score: 0,
        confidence: 0,
        communication: 0,
        correctness: 0
      });
    }

    let messages;

    if (question.type === "coding") {
      messages = [
        {
          role: "system",
          content: `
You are a DSA interviewer.

Evaluate the candidate's code.

Score 0 to 10 in these areas:
1. Confidence
2. Communication
3. Correctness

Rules:
- Correctness should heavily depend on whether the code solves the problem properly
- Consider logic, approach, edge cases, and time complexity
- Be fair and realistic
- Feedback must be short and human-like
- Return ONLY valid JSON
- No markdown
- No explanation

Return JSON in this exact format:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`
        },
        {
          role: "user",
          content: `
Question: ${question.question}
Language: ${language || "cpp"}
Code:
${trimmedCode}
`
        }
      ];
    } else {
      messages = [
        {
          role: "system",
          content: `
You are a professional human interviewer evaluating a candidate's answer.

Evaluate naturally and fairly.

Score the answer in these areas (0 to 10):
1. Confidence
2. Communication
3. Correctness

Rules:
- Be realistic and unbiased
- Do not give random high scores
- If weak, score low
- If strong and detailed, score high
- Feedback must be short, professional, and human-like
- Return ONLY valid JSON
- No markdown
- No explanation

Return JSON in this exact format:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`
        },
        {
          role: "user",
          content: `
Question: ${question.question}
Answer: ${trimmedAnswer}
`
        }
      ];
    }

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    if (!parsed) {
      return res.status(500).json({
        message: "AI returned invalid JSON while evaluating answer."
      });
    }

    question.answer = trimmedAnswer;
    question.code = trimmedCode;
    question.language = language || "cpp";
    question.confidence = Number(parsed.confidence) || 0;
    question.communication = Number(parsed.communication) || 0;
    question.correctness = Number(parsed.correctness) || 0;
    question.score = Number(parsed.finalScore) || 0;
    question.feedback = parsed.feedback || "Answer evaluated.";

    await interview.save();

    return res.status(200).json({
      feedback: question.feedback,
      score: question.score,
      confidence: question.confidence,
      communication: question.communication,
      correctness: question.correctness
    });
  } catch (error) {
    return res.status(500).json({ message: `failed to submit answer ${error.message}` });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.userId
    });

    if (!interview) {
      return res.status(400).json({ message: "failed to find Interview" });
    }

    const stats = calculateStats(interview.questions);

    interview.finalScore = stats.finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: stats.finalScore,
      confidence: stats.confidence,
      communication: stats.communication,
      correctness: stats.correctness,
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        difficulty: q.difficulty || "",
        type: q.type || "theory",
        topic: q.topic || "general",
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
        answer: q.answer || "",
        code: q.code || "",
        language: q.language || "cpp"
      }))
    });
  } catch (error) {
    return res.status(500).json({ message: `failed to finish Interview ${error.message}` });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({ message: `failed to find currentUser Interview ${error.message}` });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const stats = calculateStats(interview.questions);

    return res.json({
      finalScore: interview.finalScore || stats.finalScore,
      confidence: stats.confidence,
      communication: stats.communication,
      correctness: stats.correctness,
      questionWiseScore: interview.questions
    });
  } catch (error) {
    return res.status(500).json({ message: `failed to find currentUser Interview report ${error.message}` });
  }
};