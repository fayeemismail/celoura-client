import adminInstance from "./axiosAdminInstance";





export const adminRefreshAccessToken = async () => {
    const response = await adminInstance.post('/admin/adminRefreshAccessToken');
    return response.data;
};


export const getAllUsers = async () => {
    return adminInstance.get('/admin/adminHome-Users');
};


export const blockOrUnBlockUser = async (userId: string) => {
    const response = await adminInstance.patch(`/admin/user-block-unblock/${userId}`);
    return response
}