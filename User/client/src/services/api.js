import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    registerTeacher: (userData) => api.post('/auth/register-teacher', userData),
    getMe: () => api.get('/auth/me'),
};

// Student API
export const studentAPI = {
    getAllStudents: () => api.get('/students'),
    getStudent: (id) => api.get(`/students/${id}`),
    updateStudent: (id, data) => api.put(`/students/${id}`, data),
    uploadProfilePicture: (id, formData) =>
        api.post(`/students/${id}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};

// Result API
export const resultAPI = {
    createResult: (resultData) => api.post('/results', resultData),
    getAllResults: () => api.get('/results'),
    getStudentResults: (studentId) => api.get(`/results/student/${studentId}`),
    getResult: (id) => api.get(`/results/${id}`),
    updateResult: (id, data) => api.put(`/results/${id}`, data),
    deleteResult: (id) => api.delete(`/results/${id}`),
};

export default api;
