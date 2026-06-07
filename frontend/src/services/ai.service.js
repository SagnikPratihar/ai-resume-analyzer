import api from "./api.js";

const aiService = {
  async getResumeFeedback(resumeId, jobTitle = "") {
    const response = await api.post(`/ai/feedback/${resumeId}`, {
      job_title: jobTitle,
    });
    return response.data;
  },

  async enhanceBullets(bullets, jobTitle = "") {
    const response = await api.post("/ai/enhance-bullets", {
      bullets,
      job_title: jobTitle,
    });
    return response.data;
  },

  async generateInterviewQuestions(resumeId, jobTitle = "") {
    const response = await api.post(`/ai/interview-questions/${resumeId}`, {
      job_title: jobTitle,
    });
    return response.data;
  },
};

export default aiService;
