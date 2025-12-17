// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ backend base
  withCredentials: false,               // ❌ using JWT, not cookies
});

/* ===========================
   REQUEST INTERCEPTOR
   Automatically attach JWT
=========================== */
api.interceptors.request.use(
  (config) => {
    const doctorToken = localStorage.getItem("doctorToken");
    const patientToken = localStorage.getItem("patientToken");

    // ✅ Doctor routes get doctor token
    if (doctorToken) {
      config.headers.Authorization = `Bearer ${doctorToken}`;
    }
    // ✅ Patient routes fallback
    else if (patientToken) {
      config.headers.Authorization = `Bearer ${patientToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );

      if (error.response.status === 401) {
        console.warn("Unauthorized — token expired or invalid");
      }
    } else {
      console.error("Network / CORS error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
