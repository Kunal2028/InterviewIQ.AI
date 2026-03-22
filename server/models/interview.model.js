import mongoose from "mongoose";

const questionsSchema = new mongoose.Schema(
  {
    question: String,
    difficulty: String,
    timeLimit: Number,

    type: {
      type: String,
      enum: ["theory", "coding"],
      default: "theory"
    },

    topic: {
      type: String,
      default: "general"
    },

    language: {
      type: String,
      default: "cpp"
    },

    code: {
      type: String,
      default: ""
    },

    answer: {
      type: String,
      default: ""
    },

    feedback: {
      type: String,
      default: ""
    },

    score: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    correctness: { type: Number, default: 0 },
  },
  { _id: false }
);

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },
    resumeText: {
      type: String,
      default: "",
    },
    questions: [questionsSchema],
    finalScore: {
      type: Number,
      default: 0,
    },
    status: {
    type: String,
    enum: ["incomplete", "completed"],
    default: "incomplete",
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;