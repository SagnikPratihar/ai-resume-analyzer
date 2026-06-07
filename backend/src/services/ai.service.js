import { GoogleGenerativeAI } from "@google/generative-ai";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../utils/logger.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

const truncateText = (text, maxWords = 800) => {
  const words = text.split(" ");
  return words.length > maxWords
    ? words.slice(0, maxWords).join(" ") + "..."
    : text;
};

const parseJSON = (text) => {
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(clean);
};

const AIService = {
  async getResumeFeedback(resumeText, jobTitle = "") {
    logger.info("Generating AI resume feedback");

    const prompt = `You are an expert resume coach and HR professional with 15 years of experience.

Analyze this resume${jobTitle ? ` for a ${jobTitle} position` : ""} and provide detailed, actionable feedback.

RESUME:
${truncateText(resumeText)}

Respond with ONLY a valid JSON object in this exact format, no extra text:
{
  "overall_score": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "improvements": [
    {
      "area": "<area name>",
      "issue": "<what is wrong>",
      "suggestion": "<specific fix>"
    }
  ],
  "quick_wins": [
    "<quick improvement 1>",
    "<quick improvement 2>",
    "<quick improvement 3>"
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return parseJSON(text);
    } catch (error) {
      logger.error(`AI feedback error: ${error.message}`);
      throw new AppError("AI feedback generation failed", 500);
    }
  },

  async enhanceBullets(bullets, jobTitle = "") {
    logger.info("Enhancing bullet points");

    const bulletList = bullets.map((b, i) => `${i + 1}. ${b}`).join("\n");

    const prompt = `You are an expert resume writer. Rewrite these resume bullet points to be more impactful.

Rules:
- Start each bullet with a strong action verb
- Add quantifiable metrics where reasonable
- Be specific and results-focused
- Keep each bullet under 20 words
- Make them ATS-friendly
${jobTitle ? `- Tailor for a ${jobTitle} role` : ""}

ORIGINAL BULLETS:
${bulletList}

Respond with ONLY a valid JSON object, no extra text:
{
  "enhanced_bullets": [
    {
      "original": "<original bullet>",
      "enhanced": "<improved bullet>",
      "explanation": "<why this is better>"
    }
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return parseJSON(text);
    } catch (error) {
      logger.error(`Bullet enhancement error: ${error.message}`);
      throw new AppError("Bullet enhancement failed", 500);
    }
  },

  async generateInterviewQuestions(resumeText, jobTitle = "") {
    logger.info("Generating interview questions");

    const prompt = `You are an experienced technical interviewer.

Based on this resume${jobTitle ? ` and the ${jobTitle} role` : ""}, generate likely interview questions.

RESUME:
${truncateText(resumeText, 600)}

Respond with ONLY a valid JSON object, no extra text:
{
  "technical_questions": [
    {
      "question": "<technical question>",
      "why_asked": "<why interviewer asks this>",
      "tip": "<how to answer well>"
    }
  ],
  "behavioral_questions": [
    {
      "question": "<behavioral question>",
      "why_asked": "<why interviewer asks this>",
      "tip": "<how to answer well>"
    }
  ],
  "resume_specific_questions": [
    {
      "question": "<question about specific resume item>",
      "context": "<which resume item this is about>"
    }
  ]
}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return parseJSON(text);
    } catch (error) {
      logger.error(`Interview questions error: ${error.message}`);
      throw new AppError("Interview question generation failed", 500);
    }
  },
};

export default AIService;
