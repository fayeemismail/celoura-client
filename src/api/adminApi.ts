import axiosInstance from "./axiosInstance"



export const getAllUsers = async () => {
    return axiosInstance.get('/admin/adminHome');
};