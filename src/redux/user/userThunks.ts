// /redux/user/userThunks.ts
import { commentOnGuidePostApi, editProfile, followGuideApi, getAllGuidesOnUserApi, getAllPostGuideApi, getCurrentMe, getDestinationsApi, getGuideSingleDataApi, getGuideSinglePostApi, getNewDestinationApi, hasRegistered, likePostUserApi, pageinatedDestiUserApi, replyCommentOnGuidePostApi, singleSpotApi, unfollowGuideApi, unLikePostUserApi } from "../../api/userAPI";
import { AddCommentArgs, AddReplyComment } from "../../types/CommentReqSummary";
import { UpdateProfilePayload } from "../../types/user";
import { AppDispatch } from "../store";
import {
  signOut,
  updateUserFailure,
  updateUserPending,
  updateUserSuccess,
} from "./userSlice";

export const handleUpdateProfile = (payload: UpdateProfilePayload) => {
  return async (dispatch: AppDispatch) => {
    dispatch(updateUserPending());

    try {
      const result = await editProfile(payload);
      console.log(result.data?.data, 'this is result');
      dispatch(updateUserSuccess(result.data?.data));
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to update profile";

      if (status === 403 || error?.response?.data?.blocked) {
        dispatch(signOut());
      };

      dispatch(updateUserFailure(message));
      throw new Error(message); 
    }
  };
};

export const hasRegisteredThunk = (userId: string) => {
  return async() => {
    try {
      const response = await hasRegistered(userId);
      return response.data;
    } catch (error) {
      console.log(error, 'this is error');
      throw error
    }
  }
} 


export const GetAllDestinations = () => {
  return async () => {
    try {
      const data = await getDestinationsApi();
      return data
    } catch (error: any) {
      console.log(error.message);
      throw error.message
    }
  }
}


export const GetSingleDestination = (id: string) => {
  return async() => {
    try {
      const response = await singleSpotApi(id);
      return response.data
    } catch (error: any) {
      console.log(error.message);
      throw error
    }
  }
}

export const getAllPaginatedDestiUser = (page = 1, limit = 9, search = "", attraction = "") => {
    return async() => {
        try {
            const response = await pageinatedDestiUserApi(page, limit, search, attraction);
            return response.data
        } catch (error: any) {
            console.error('Error on Getting paginated: ', error.message);
            throw error
        }
    }
}

export const getNewDestinationsThunk = (limit: number) => {
  return async() => {
    try {
      const response = await getNewDestinationApi(limit);
      return response
    } catch (error: any) {
      console.log(error.message);
      throw error
    }
  }
}



export const getCurrentMeThunk = (id: string) => {
  return async() => {
    try {
      const response = await getCurrentMe(id);
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}

export const getAllGuidesOnUserThunk = (page: number, limit: number, search: string, category: string) => {
  return async() => {
    try {
      const response = await getAllGuidesOnUserApi(page, limit, search, category);
      return response.data
    } catch (error) {
      console.log(error);
      throw error
    }
  }
};



export const getGuideSingleDataThunk = (id: string) => {
  return async() => {
    try {
      const response = await getGuideSingleDataApi(id);
      return response.data
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

export const getAllPostGUideThunk = (id: string) => {
  return async() => {
    try {
      const response = await getAllPostGuideApi(id);
      return response.data
    } catch (error) {
      console.log(error, 'error on getting posts');
      throw error;
    }
  }
};

export const getGuideSinglePostThunk = (postId: string) => {
  return async() => {
    try {
      const response = await getGuideSinglePostApi(postId);
      return response.data;
    } catch (error) {
      console.log(error, "error on fetching post");
      throw error;
    }
  }
}


export const likePostThunkUser = (postId: string, userId: string) => {
  return async() => {
    try {
      console.log(postId, 'postId', userId, 'UserId')
      const response = await likePostUserApi(postId, userId);
      return response
    } catch (error) {
      console.log(error);
      throw error
    }
  }
};

export const unLikePostThunkUser = (postId: string, userId: string) => {
  return async() => {
    try {
      const response = await unLikePostUserApi(postId, userId);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
};

export const addCommentOnGuidePostThunk = ({postId, content, userId}: AddCommentArgs) => {
  return async() => {
    try {
      const response = await commentOnGuidePostApi({postId, content, userId});
      return response.data;
    } catch (error) {
      console.log(error, 'erro on add cooment');
      throw error;
    }
  }
};

export const addReplyCommentOnGuidePostThunk = ({postId, content, userId, parentId}: AddReplyComment) => {
  return async() => {
    try {
      const response = await replyCommentOnGuidePostApi({ postId, content, userId, parentId });
      return response.data;
    } catch (error) {
      console.log(error, 'on Reply Comment');
      throw error;
    }
  }
};


export const followGuideThunk = (guideId: string, requesterId: string) => {
  return async() => {
    try {
      const response = await followGuideApi(guideId, requesterId);
      return response.data;
    } catch (error) {
      console.log(error, 'Error on following');
      throw error;
    }
  }
};

export const unfollowGuideThunk = (guideId: string, requesterId: string) => {
  return async() => {
    try {
      const response = await unfollowGuideApi(guideId, requesterId);
      return response.data;
    } catch (error) {
      console.log(error, 'Error on unfollow');
      throw error;
    }
  }
}