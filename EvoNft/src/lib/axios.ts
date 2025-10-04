import axios from 'axios';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // This is crucial for sending cookies with requests
});

export default apiClient;