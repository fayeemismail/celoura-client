import axiosInstance from "./axiosInstance";




//login auth admin
export const login = async (formData: {email: string; password: string}) => {
    const response = await axiosInstance.post('/auth/login', formData);
    return response.data;
};

export const adminLogin = async ( formData: { email: string; password: string } ) => {
    const response = await axiosInstance.post('auth/admin/login', formData);
    return response.data;
}

export const refreshAccessToken = async () => {
    const response = await axiosInstance.post('/auth/refresh-token');
    return response.data;
}

export const getCurrentUser = async () => {
    return axiosInstance.get('/auth/me');
};

export const editProfile = async (payload: Object) => {
    const response = await axiosInstance.put('/user/editProfile', payload);
    return response
}

export const logoutUser = async () => {
    return axiosInstance.post('/auth/logout')
}