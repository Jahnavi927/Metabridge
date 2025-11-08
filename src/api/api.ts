// ✅ src/api.ts
import axios from "axios";

// 🔹 Create a single axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend base URL
  withCredentials: false,                // set true only if you use cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Add an interceptor to attach JWT tokens automatically
api.interceptors.request.use(
  (config) => {
    const doctorToken = localStorage.getItem("doctorToken");
    const patientToken = localStorage.getItem("patientToken");

    if (doctorToken) {
      config.headers.Authorization = `Bearer ${doctorToken}`;
    } else if (patientToken) {
      config.headers.Authorization = `Bearer ${patientToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Optional: response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Unauthorized — redirecting to login...");
      // You can add a redirect logic here
    }
    return Promise.reject(error);
  }
);

export default api;
