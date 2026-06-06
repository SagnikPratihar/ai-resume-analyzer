import api from "./api.js";

const jdService = {
  async matchWithResume(resumeId, jdData) {
    const response = await api.post(`/analyses/match/${resumeId}`, jdData);
    return response.data;
  },
};

export default jdService;
