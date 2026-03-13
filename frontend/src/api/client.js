import axios from 'axios';

const API_BASE_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:8000/api/'
  : 'https://raithumandi-api-761402963507.us-central1.run.app/api/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
