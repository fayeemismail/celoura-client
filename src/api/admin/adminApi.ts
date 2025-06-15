import adminInstance from "./axiosAdminInstance";





export const adminRefreshAccessToken = async () => {
    const response = await adminInstance.post('/admin/adminRefreshAccessToken');
    return response.data;
};


export const getAllUsers = async (page: number, limit: number, role: 'user' | 'guide', search: string) => {
  return adminInstance.get(`/admin/adminHome-Users?page=${page}&limit=${limit}&role=${role}&search=${search}`);
};


export const getAllCount = async () => {
    return adminInstance.get('/admin/users/total-count');
};

export const BlockUser = async (userId: string) => {
    return await adminInstance.patch(`/admin/users/${userId}/block` );
};

export const unBlockUser = async (userId: string) => {
    return await adminInstance.patch(`/admin/users/${userId}/unBlock`); 
};

export  const getAppliesGuide = async (page: number, limit: number) => {
    return await adminInstance.get(`/admin/users/get-guide-applications?page=${page}&limit=${limit}`)
};


export const guideApproveApi = async (applicationId: string, userId: string) => {
    return await adminInstance.patch(`/admin/users/approveAsGuide`, { applicationId, userId })
}

export const guideRejectApi = async (applicationId: string, userId: string) => {
    return await adminInstance.patch(`/admin/users/rejectAsGuide`, { applicationId, userId })
};

export const createDestinationApi = async( 
    formData: FormData
  ) => {
    return await adminInstance.post('/admin/destination/create-destination', formData)
  }