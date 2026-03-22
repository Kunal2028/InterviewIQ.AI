import express from "express";
import { analyzeResume, matchResume } from "../controllers/resume.controller.js";
import resumeUpload from "../middlewares/resumeUpload.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/analyze", isAuth, resumeUpload.single("resume"), analyzeResume);
router.post("/match", isAuth, resumeUpload.single("resume"), matchResume);

export default router;