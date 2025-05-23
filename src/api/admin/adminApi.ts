import adminInstance from "./axiosAdminInstance";





export const adminRefreshAccessToken = async () => {
    const response = await adminInstance.post('/admin/adminRefreshAccessToken');
    return response.data;
};


export const getAllUsers = async () => {
    return adminInstance.get('/admin/adminHome-Users');
};


export const BlockUser = async (userId: string) => {
    return await adminInstance.patch(`/admin/users/${userId}/block` );
};

export const unBlockUser = async (userId: string) => {
    return await adminInstance.patch(`/admin/users/${userId}/unBlock`); 
};