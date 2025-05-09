import axios from "axios";
import { API_BASE_URL } from "../config/constants";
import { handleTokenRefresh } from "../redux/user/authThunks";
import { store } from "../redux/store";

const axiosInstance = axios.create({ 
    baseURL : API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true
});


// Flag to avoid infinite loops
let isRefreshing = false;

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if(
            error.response?.status == 401 && 
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if(!isRefreshing) {
                isRefreshing = true;
                try {
                    await store.dispatch<any>(handleTokenRefresh());
                    isRefreshing = false;
          
                    // Retry original request after refreshing token
                    return axiosInstance(originalRequest);
                  } catch (refreshError) {
                    isRefreshing = false;
                    // Optional: logout or redirect to login
                  }
            }

        }
        return Promise.reject(error);
    }
);


export default axiosInstance;