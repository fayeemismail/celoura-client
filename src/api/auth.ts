import adminInstance from "./admin/axiosAdminInstance";
import guideInstance from "./guide/axiosGuideInstance";
import axiosInstance from "./axiosInstance";
import axios from "axios";
import { API_BASE_URL } from "../config/constants";




//login auth admin
export const login = async (formData: {email: string; password: string}) => {
    const response = await axiosInstance.post('/auth/login', formData);
    return response.data;
};

export const googleLogin = async(email: string, name: string) => {
        try {
            const result = await axios.post(
                `${API_BASE_URL}/auth/google-login`,
                {email, name},
                {
                    withCredentials: true
                }
            )
            .then((response) => {
                return response
            });
            return result;
        } catch (error: any) {
            console.log(error, 'Error on the Google Login Api');
            return error.response;
        }
};

export const guideGoogleLogin = async(email: string, name: string) => {
    try {
        const result = await axios.post(
            `${API_BASE_URL}/auth/guide-google-login`,
            {email, name},
            {
                withCredentials: true
            }
        )
        .then((response) => {
            return response
        });
        return result;
    } catch (error: any) {
        console.log(error, 'Error On Guide Google Login');
        return error.response;
    }
}

export const adminLogin = async ( formData: { email: string; password: string } ) => {
    const response = await adminInstance.post('/auth/admin/login', formData);
    return response.data;
};


export const guideLogin = async (formData: { email: string, password: string }) => {
    const response = await guideInstance.post('/auth/guide/login', formData);
    return response.data;
};



export const refreshAccessToken = async () => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
};


export const getCurrentUser = async () => {
    return axiosInstance.get('/auth/me');
};





export const logoutUser = async () => {
    return axiosInstance.post('/auth/logout')
};


export const logoutAdmin = async () => {
    return axiosInstance.post('/auth/adminLogout');
};

export const logoutGuide = async () => {
    return axiosInstance.post('/auth/guide/logout')
} 