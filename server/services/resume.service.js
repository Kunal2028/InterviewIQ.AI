import OpenAI from "openai";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const client = process.env.OPENROUTER_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    })
  : null;

// Preserves newlines — only collapses horizontal whitespace
const cleanText = (text = "") => {
  return text
    .replace(/[ \t]+/g, " ")     // collapse spaces/tabs only
    .replace(/\n{3,}/g, "\n\n")  // max 2 consecutive newlines
    .trim();
};

// Extracts text from PDF buffer using pdfjs-dist, preserving line breaks
const extractTextFromPDF = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;

  const pageTexts = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    let lastY = null;
    let pageText = "";

    for (const item of content.items) {
      if ("str" in item) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += "\n";
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
    }

    pageTexts.push(pageText);
  }

  return pageTexts.join("\n\n").trim();
};

const extractKeywords = (text = "") => {
  const words = [
    "javascript", "typescript", "react", "redux", "node", "express",
    "mongodb", "mongoose", "mysql", "sql", "postgresql", "html", "css",
    "tailwind", "bootstrap", "firebase", "rest api", "api", "nextjs",
    "next", "java", "python", "c++", "c", "docker", "kubernetes", "aws",
    "git", "github", "machine learning", "deep learning", "nlp", "llm",
    "openai", "data structures", "algorithms", "dbms", "os",
    "computer networks", "system design",
  ];

  const lower = text.toLowerCase();
  return words.filter((item) => lower.includes(item));
};

const getMatchedKeywords = (resumeText, jobText) => {
  const resumeWords = extractKeywords(resumeText);
  const jobWords = extractKeywords(jobText);
  return jobWords.filter((word) => resumeWords.includes(word));
};

const getMissingKeywords = (resumeText, jobText) => {
  const resumeWords = extractKeywords(resumeText);
  const jobWords = extractKeywords(jobText);
  return jobWords.filter((word) => !resumeWords.includes(word));
};

const getScore = (resumeText, jobText) => {
  const matched = getMatchedKeywords(resumeText, jobText);
  const missing = getMissingKeywords(resumeText, jobText);
  const total = matched.length + missing.length;
  if (total === 0) return 50;
  return Math.max(0, Math.min(100, Math.round((matched.length / total) * 100)));
};

export const extractResumeText = async (file) => {
  if (!file) throw new Error("Resume file is required");

  if (file.mimetype === "application/pdf") {
    const text = await extractTextFromPDF(file.buffer);
    return cleanText(text);
  }

  if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword"
  ) {
    const data = await mammoth.extractRawText({ buffer: file.buffer });
    return cleanText(data.value || "");
  }

  throw new Error("Unsupported file type");
};

const getFallbackAnalysis = (resumeText, jobDescription = "") => {
  const text = resumeText.toLowerCase();

  const strengths = [];
  const weaknesses = [];
  const improvements = [];

  if (text.includes("project")) strengths.push("Projects section is present");
  else weaknesses.push("Projects section is missing");

  if (text.includes("skill")) strengths.push("Skills section is present");
  else weaknesses.push("Skills section is missing");

  if (text.includes("experience") || text.includes("intern")) {
    strengths.push("Experience or internship section is present");
  } else {
    weaknesses.push("Experience section looks weak or missing");
  }

  if (text.includes("github") || text.includes("linkedin")) {
    strengths.push("Professional links are included");
  } else {
    improvements.push("Add GitHub and LinkedIn links");
  }

  if (/\b\d+%|\b\d+\+|\b\d+\b/.test(resumeText)) {
    strengths.push("Resume has some quantified impact");
  } else {
    weaknesses.push("Resume lacks quantified achievements");
    improvements.push("Add measurable impact like percentages, users, ranking, performance gains");
  }

  if (!text.includes("summary")) {
    improvements.push("Add a short professional summary at the top");
  }

  const missingKeywords = jobDescription ? getMissingKeywords(resumeText, jobDescription) : [];
  const jobMatchScore = jobDescription ? getScore(resumeText, jobDescription) : 0;
  const atsScore = Math.max(
    40,
    Math.min(95, 65 + strengths.length * 6 - weaknesses.length * 4 - Math.min(missingKeywords.length, 5) * 3)
  );
  const overallScore = jobDescription ? Math.round((atsScore + jobMatchScore) / 2) : atsScore;

  return {
    overall_score: overallScore,
    ats_score: atsScore,
    job_match_score: jobMatchScore,
    summary:
      "Your resume has a good base but can be improved with stronger keywords, better measurable achievements, and clearer section presentation.",
    strengths,
    weaknesses,
    improvements,
    keywords_missing: missingKeywords,
  };
};

export const analyzeResumeService = async (file, jobDescription = "") => {
  const resumeText = await extractResumeText(file);

  if (!resumeText || resumeText.length < 30) {
    throw new Error("Could not extract enough text from the resume");
  }

  if (!client) {
    return getFallbackAnalysis(resumeText, jobDescription);
  }

  try {
    const hasJobDescription = jobDescription && jobDescription.trim().length > 10;

    const systemPrompt = `You are ResumeIQ — a world-class senior hiring consultant and ATS optimization expert with 15+ years of experience in technical recruitment at top-tier companies including FAANG, Fortune 500, and high-growth startups.

Your evaluations are trusted by thousands of candidates to land interviews at competitive companies. You analyze resumes with the precision of a recruiter, the technical depth of a senior engineer, and the strategic insight of a career coach.

You always return ONLY a valid, minified JSON object — no markdown, no preamble, no explanation outside the JSON. Any deviation will break the system.`;

    const userPrompt = `Perform a comprehensive, expert-level resume analysis and return a single JSON object in exactly this structure:

{
  "overall_score": <integer 0–100>,
  "ats_score": <integer 0–100>,
  "job_match_score": <integer 0–100>,
  "summary": <string — 2–3 sentence executive summary of the resume's overall quality, positioning, and readiness>,
  "strengths": <array of 3–5 strings — specific, evidence-based strengths observed in the resume>,
  "weaknesses": <array of 3–5 strings — honest, constructive weaknesses that are holding this resume back>,
  "improvements": <array of 4–6 strings — precise, actionable steps the candidate should take immediately>,
  "keywords_missing": <array of strings — important keywords, skills, or tools absent from the resume but relevant to the role or industry>
}

--- SCORING CRITERIA ---

overall_score (0–100):
  Holistic quality score. Combine ATS compatibility, content depth, clarity, formatting signal, and job relevance.
  90–100 = Ready to send to top companies as-is
  75–89  = Strong with minor gaps
  60–74  = Decent but needs targeted improvements
  40–59  = Significant restructuring needed
  0–39   = Major overhaul required

ats_score (0–100):
  Evaluate purely on ATS compatibility:
  - Presence of standard sections (Summary, Experience, Education, Skills)
  - Use of industry-standard job titles and keywords
  - Avoidance of tables, graphics, columns, headers/footers that break parsers
  - Consistent date formatting
  - Appropriate length (1 page for <5 yrs exp, 2 pages for senior)
  - Keyword density relative to typical job postings in this domain

job_match_score (0–100):
  ${hasJobDescription
    ? "Score based on alignment between the resume and the provided job description. Consider: skill overlap, seniority match, domain experience, and keyword coverage."
    : "No job description provided. Score based on general market readiness for roles that match the candidate's apparent target domain and experience level."
  }

--- QUALITY STANDARDS FOR EACH FIELD ---

summary:
  Write like a senior recruiter's internal note. Be direct and specific. Mention the candidate's apparent level, domain, and 1–2 standout qualities or gaps.

strengths:
  Each point must reference something SPECIFIC found in the resume (e.g., "Quantified impact in 3 of 4 experience bullets shows results-oriented mindset" not "Has experience").

weaknesses:
  Be honest and constructive. Avoid vague feedback. Bad: "Lacks experience." Good: "No evidence of system design exposure despite senior-level role targets — no architecture diagrams, design decisions, or scalability work mentioned."

improvements:
  Give precise, immediately actionable steps. Bad: "Add more keywords." Good: "Add a dedicated 'Technical Skills' section above the fold listing languages, frameworks, cloud platforms, and tools — ATS parsers prioritize early keyword density."

keywords_missing:
  Include skills, tools, frameworks, certifications, or methodologies that are absent but expected for this candidate's level and target role.

--- RESUME TO ANALYZE ---
${resumeText}

${hasJobDescription ? `--- TARGET JOB DESCRIPTION ---\n${jobDescription}` : "--- NOTE: No job description provided. Assess for general industry readiness. ---"}

Return only the JSON object. No markdown. No explanation. No code fences.`;

    const response = await client.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    });

    const content = response.choices?.[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch {
    return getFallbackAnalysis(resumeText, jobDescription);
  }
};

export const matchResumeService = async (file, job) => {
  const resumeText = await extractResumeText(file);

  if (!resumeText || resumeText.length < 30) {
    throw new Error("Could not extract enough text from the resume");
  }

  const matched = getMatchedKeywords(resumeText, job);
  const missing = getMissingKeywords(resumeText, job);
  const score = getScore(resumeText, job);

  return { score, matched, missing };
};