import axios from "axios";
const API = import.meta.env.VITE_API_BASE_URL;
const mode=import.meta.env.MODE;
const BASEURL=mode==="development"?"http://localhost:8000":API;
const axiosInstance = axios.create({
  baseURL: BASEURL,
  withCredentials: true, // 🔥 REQUIRED FOR COOKIES
});

    // axiosInstance.interceptors.response.use(
    //   res => res,
    //   err => {
    //     if (err.response?.status === 401) {
    //       localStorage.removeItem("token"); // optional if cookie-only auth
    //       window.location.href = "/login";
    //     }
    //     return Promise.reject(err);
    //   }
    // );

export default axiosInstance;
