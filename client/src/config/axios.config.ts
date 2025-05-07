import axios, { AxiosInstance } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASEURL as string, 
  // baseURL: '/api', 
  withCredentials: true,
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


axiosInstance.interceptors.response.use(res => res, err => {
  return Promise.reject({
    serverErrorResponse: err.response?.data
  });
});

export default axiosInstance;