import axios from "axios";
import { API_BASE_URL } from "../../config/constants";
import { store } from "../../redux/store";
import { handleAdminTokenRefresh } from "../../redux/admin/authThunks";




const adminInstance = axios.create({
    baseURL: API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true,
});

let isRefreshing = false;

adminInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await store.dispatch<any>(handleAdminTokenRefresh());
                    isRefreshing = false;

                    return adminInstance(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                }
            }
        }
        return Promise.reject(error);
    }
);


export default adminInstance;