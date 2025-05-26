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

export  const getAppliesGuide = async () => {
    return await adminInstance.get('/admin/users/get-guide-applications')
};


export const guideApproveApi = async (applicationId: string, userId: string) => {
    return await adminInstance.patch(`/admin/users/approveAsGuide`, { applicationId, userId })
}

export const guideRejectApi = async (applicationId: string, userId: string) => {
    return await adminInstance.patch(`/admin/users/rejectAsGuide`, { applicationId, userId })
}