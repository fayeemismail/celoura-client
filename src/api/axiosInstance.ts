import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { handleTokenRefresh } from "../redux/user/authThunks";
import { store } from "../redux/store";

const axiosInstance = axios.create({ 
    baseURL : API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true
});


let isRefreshing = false;

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    console.warn("🔁 Axios Interceptor Triggered"); 

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      console.warn("⛔ 401 Detected, trying to refresh token..."); 

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await store.dispatch<any>(handleTokenRefresh());
          isRefreshing = false;

          console.log("✅ Token refreshed. Retrying original request...");
          return axiosInstance(originalRequest); 
        } catch (refreshError) {
          console.error("❌ Refresh token failed", refreshError);
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;