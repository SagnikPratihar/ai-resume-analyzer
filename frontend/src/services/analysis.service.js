import api from "./api.js";

const analysisService = {
  async analyzeResume(resumeId) {
    const response = await api.post(`/analyses/resume/${resumeId}`);
    return response.data;
  },

  async getAll() {
    const response = await api.get("/analyses");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/analyses/${id}`);
    return response.data;
  },
};

export default analysisService;
