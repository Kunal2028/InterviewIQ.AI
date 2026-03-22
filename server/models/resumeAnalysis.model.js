import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
    },
    jobDescription: {
      type: String,
      default: "",
    },
    overallScore: {
      type: Number,
      default: 0,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    jobMatchScore: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      default: "",
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    keywordsMissing: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;