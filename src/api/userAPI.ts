import axiosInstance from "./axiosInstance"



export const applyForGuide = (formData: FormData) => {
  return axiosInstance.post("/user/apply-for-guide", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};



export const editProfile = async (payload: Object) => {
    const response = await axiosInstance.put('/user/editProfile', payload);
    return response
};

export const getDestinationsApi = async () => {
  return await axiosInstance.get('/user/destinations');
}

export const singleSpotApi = async (id: string) => {
  return await axiosInstance.get(`/user/destinations/${id}`);
}

export const pageinatedDestiUserApi = async (page: number, limit: number, search: string, attraction: string) => {
  return await axiosInstance.get(`/user/destination?page=${page}&limit=${limit}&search=${search}&attraction=${attraction}`);
}

export const getNewDestinationApi = async (limit: number) => {
  return await axiosInstance.get(`/user/destinations/new-spots/${limit}`);
}

export const getCurrentMe = async (id: string) => {
  return await axiosInstance.get(`/user/get-UserProfile/${id}`);
};

export const getAllGuidesOnUserApi = async(page: number, limit: number, search: string, category: string) => {
  return await axiosInstance.get(`/user/get-guides?page=${page}&limit=${limit}&search=${search}&category=${category}`);
}