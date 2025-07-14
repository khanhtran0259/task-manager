import axios from 'axios';
import { BASE_URL } from './apiPath';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
      'Accept': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
      (config) => {
            const accessToken = localStorage.getItem('token');
            if (accessToken) {
                  config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
      },
      (error) => {
            return Promise.reject(error);
      }
);

axiosInstance.interceptors.response.use(
      (response) => {
            return response;
      },
      (error) => {
            if (error.response && error.response.status === 401) {
                  window.location.href = '/login'; // Redirect to login on 401 Unauthorized

            }
            else if (error.response && error.response.status === 500) {
               console.error('Server Error:', error.response.data.message || 'Internal Server Error');
            } else {
                  console.error('Error:', error.message || 'An error occurred');
            }
            return Promise.reject(error);
      }
);
export default axiosInstance;
