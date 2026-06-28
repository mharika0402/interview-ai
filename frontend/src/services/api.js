import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('interviewAI_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const interviewAPI = {
  getQuestions: (data) => api.post('/interview/questions', data),
  evaluateAnswer: (data) => api.post('/interview/evaluate', data),
  getResults: (data) => api.post('/interview/results', data),
};

export const codingAPI = {
  getProblem: () => api.get('/coding/problem'),
  submitCode: (data) => api.post('/coding/submit', data),
};

export const hrAPI = {
  getQuestions: () => api.get('/hr/questions'),
  evaluateAnswer: (data) => api.post('/hr/evaluate', data),
};

export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
};

export default api;
