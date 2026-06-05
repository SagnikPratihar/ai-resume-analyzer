import api from './api.js'

const resumeService = {
  async upload(file) {
    const formData = new FormData()
    formData.append('resume', file)

    const response = await api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  async getAll() {
    const response = await api.get('/resumes')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/resumes/${id}`)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/resumes/${id}`)
    return response.data
  },
}

export default resumeService