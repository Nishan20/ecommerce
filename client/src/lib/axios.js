import axios from "axios";

const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:4000/api/v1" 
  : "/api/v1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
      console.log("Unauthorized - Redirect to login");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

