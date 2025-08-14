import { guideRejection } from "../../types/Guide";
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

export const guideRejectApi = async ({applicationId, userId, reason}: guideRejection) => {
    return await adminInstance.patch(`/admin/users/rejectAsGuide`, { applicationId, userId, reason })
};


export const uploadDestinationPhotosApi = async(count: number) => {
    return await adminInstance.get(`/admin/destination/generate-signed-urls`, {
        params: {count}
    })
}

export const createDestinationApi = async (formData: Record<string, any>) => {
  return await adminInstance.post("/admin/destination/create-destination", formData, {
    headers: { "Content-Type": "application/json" }, 
  });
};


export const getDestinationsApi = async () => {
    return await adminInstance.get('/admin/destinations');
};


export const pageinatedDestinations = async (page: number, limit: number, search: string, attraction: string) => {
    return await adminInstance.get(`/admin/destination?page=${page}&limit=${limit}&search=${search}&attraction=${attraction}`)
};

export const deleteDestinationApi = async (destinationId: string) => {
    return await adminInstance.delete(`/admin/destinations/${destinationId}/delete`);
};

export const getDestinationById = async(id: string) => {
    return await adminInstance.get(`/admin/destinations/get-destinations/${id}` );
};


export const updateDestinationApi = async(id: string, formData: FormData) => {
    return await adminInstance.put(`/admin/destination/edit-destination/${id}`, formData)
};