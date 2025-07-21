import axiosInstance from "./axiosInstance"
import { AddCommentArgs, AddReplyComment } from "../types/CommentReqSummary";



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
};

export const getGuideSingleDataApi = async(id: string) => {
  return await axiosInstance.get(`/user/guide/${id}`);
};

export const getAllPostGuideApi = async(id: string) => {
  return await axiosInstance.get(`/user/guide/posts/${id}`);
};

export const likePostUserApi = async(postId: string, userId: string) => {
  return await axiosInstance.put(`/user/like/${postId}/${userId}`);
};

export const unLikePostUserApi = async(postId: string, userId: string) => {
  return await axiosInstance.delete(`/user/like/${postId}/${userId}`);
};

export const commentOnGuidePostApi = async({ postId, content, userId }: AddCommentArgs) => {
  return await axiosInstance.post('/user/comment', { postId, content, userId });
};

export const replyCommentOnGuidePostApi = async({ postId, content, userId, parentId }: AddReplyComment) => {
  return await axiosInstance.post('/user/reply-comment', { postId, content, userId, parentId });
};