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