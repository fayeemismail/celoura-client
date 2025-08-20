import { AddCommentArgs } from "../../types/CommentReqSummary";
import guideInstance from "./axiosGuideInstance"
import { AddReplyComment } from "../../types/CommentReqSummary";



export const guideRefreshAccessToken = async () => {
    const response = await guideInstance.post('/guide/guideRefreshAccessToken');
    return response.data;
}



export const getMyDetails = async (id: string) => {
    return guideInstance.get(`/guide/getme?id=${id}`);
};

export const getPaginatiedDestinationGuideAPI = async (page: number, limit: number, search: string, attraction: string) => {
    return await guideInstance.get(`/guide/destination?page=${page}&limit=${limit}&search=${search}&attraction=${attraction}`)
};

export const getNewDestinationApi = async(limit: number) => {
    return await guideInstance.get(`/guide/destinations/new-spots/${limit}`);
};


export const getdestinations = async() => {
    return await guideInstance.get('/guide/destinations')
};

export const getProfileDataAPI = async(id: string) => {
    return await guideInstance.get(`/guide/profile/${id}`);
};



export const updateProfileGuideApi = async(formData: FormData) => {
    return await guideInstance.put('/guide/profile/edit-profile-update', formData);
};


export const createNewPostApi = async(formData: FormData) => {
    return await guideInstance.post('/guide/posts/new-post', formData);
};

export const getGuideAllPostApi = async(id: string) => {
    return await guideInstance.get(`/guide/posts/allposts/${id}`)
};


export const getSinglePostApi = async(id: string) => {
    return await guideInstance.get(`/guide/posts/${id}/single`)
};


export const likePostApi = async(id: string, userId: string) => {
    return await guideInstance.put(`/guide/like/${id}/${userId}`);
};

export const unlikePostApi = async(id: string, userId: string) => {
    return await guideInstance.delete(`/guide/like/${id}/${userId}`);
};

export const commentPostApi = async({postId, content, userId}: AddCommentArgs) => {
    return await guideInstance.post(`/guide/comment`, { postId, content, userId })
};


export const replyCommentPostApi = async({ postId, content, userId, parentId }: AddReplyComment) => {
    return await guideInstance.post('/guide/reply-comment', { postId, content, userId, parentId });
}

export const getDetailedDestinationApi = async(destinationId: string) => {
    return await guideInstance.get(`/guide/get-destination/${destinationId}`);
};

export const newAvailableDestinationGuideApi = async(destinationId: string, guideId: string) => {
    return await guideInstance.put(`/guide/add-availableDestination/${destinationId}/${guideId}`)
};

export const fetchBookingsOnGuideApi = async(guideId: string, page: number, limit: number, search: string, status: string) => {
    return await guideInstance.get(`/guide/fetch-bookings/${guideId}`, {
        params: { page, limit, search, status }
    });
}