import axios from 'axios';

const api = axios.create({
  // O Vite usa import.meta.env para variáveis de ambiente
  baseURL: import.meta.env.VITE_API_URL || 'https://38cf-200-17-34-1.ngrok-free.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;