import {
  analyzeResumeService,
  matchResumeService,
} from "../services/resume.service.js";

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const jobDescription = req.body.jobDescription || "";

    const result = await analyzeResumeService(req.file, jobDescription);

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      data: result,
    });
  } catch (error) {
    console.log("analyzeResume error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze resume",
    });
  }
};

export const matchResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const job = req.body.job || "";

    if (!job.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description is required",
      });
    }

    const result = await matchResumeService(req.file, job);

    return res.status(200).json({
      success: true,
      message: "Resume matched successfully",
      data: result,
    });
  } catch (error) {
    console.log("matchResume error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to match resume",
    });
  }
};