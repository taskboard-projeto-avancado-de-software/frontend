import axios from 'axios';

const api = axios.create({
  baseURL: 'https://taskboard-backend-27wv.onrender.com/', 
});

export default api;