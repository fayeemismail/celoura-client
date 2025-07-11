import { guideLogin, logoutGuide } from "../../api/auth";
import { commentPostApi, createNewPostApi, getdestinations, getGuideAllPostApi, getMyDetails, getNewDestinationApi, getPaginatiedDestinationGuideAPI, getProfileDataAPI, getSinglePostApi, guideRefreshAccessToken, likePostApi, unlikePostApi, updateProfileGuideApi } from "../../api/guide/guideApi";
import { AddCommentArgs } from "../../types/CommentReqSummary";
import { signInFailure, signInPending, signInSuccess, signOut, updateGuidePending } from "./guideSlice"




export const handleGuideLogin = ( formData: { email: string, password: string } ) => {
    return async (dispatch: any) => {
        try {
            dispatch(signInPending());

            const response = await guideLogin(formData);

            dispatch(signInSuccess(response));

        } catch (error: any) {
            console.log(error);
            dispatch(signInFailure(error.response?.data?.message || "Login failed"));
        }
    }
};


export const getPaginatedDestinationGuideThunk = (page: number, limit: number, search: string, attraction: string) => {
    return async() => {
        try {
            const response = await getPaginatiedDestinationGuideAPI(page, limit, search, attraction);
            console.log(response.data, 'this is data')
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
};

export const getCompleteDesti = () => {
    return async() => {
        try {
            const response = await getdestinations();
            return response
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}


export const handleGuideTokenRefresh = (): any => {
    return async (dispatch: any, getState: any) => {
        try {
            const state = getState();
            const currentGuide = state.guide?.currentGuide;

            if(!currentGuide) {
                console.warn('No current guide found in Redux. Logging out...');
                await logoutGuide();
                dispatch(signOut());
                return 
            }

            await guideRefreshAccessToken()
        } catch (error: any) {
            console.error('Guide token refresh faied:', error.response?.data?.error);
            dispatch(signOut())
        }
    }
}


export const handleGuideLogout = () => {
    return async (dispatch: any) => {
        try {
            
            await logoutGuide();

            dispatch(signOut());
        } catch (error: any) {
            console.log(error)
        }
    }
};




export const getMe = (id: string) => {
    return async () => {
        try {
            const Users = await getMyDetails(id);
            return Users.data;
        } catch (error) {
            console.error('something wrong with fetching data', error);
        }
    }
};



export const getNewDestinationsThunk = (limit: number) => {
    return async() => {
        try {
            const res = await getNewDestinationApi(limit);
            return res.data
        } catch (error) {
            console.error("something went wrong on fetching destination", error);
            throw error
        }
    }
};


export const getProfileGuide = (id: string) => {
    return async() => {
        try {
            const response = await getProfileDataAPI(id);
            return response.data
        } catch (error) {
            console.log(error);
            throw error
        }
    }
};


export const updateProfileGuideThunk = (formData: FormData) => {
    return async(dispatch: any) => {
        dispatch(updateGuidePending());
        try {
            const response = await updateProfileGuideApi(formData);
            console.log(response.data , 'this is response Data');
            return response.data
        } catch (error) {
            console.log(error);
            throw error
        }
    }
};


export const createNewPostThunk = (formdata: FormData) => {
    return async() => {
        try {
            const response = await createNewPostApi(formdata);
            console.log(response);
            return response;
        } catch (error) {
            console.log(error, 'Error creating new Post')
            throw error;
        }
    }
};


export const getGuideAllPosts = (id: string) => {
    return async() => {
        try {
            const response = await getGuideAllPostApi(id);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};

export const getSinglePostThunk = (id: string) => {
    return async() => {
        try {
            const response = await getSinglePostApi(id);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

export const likePostThunk = (id: string, userId: string) => {
    return async() => {
        try {
            const response = await likePostApi(id, userId);
            return response
        } catch (error) {
            console.log(error, 'error on liking');
            throw error
        }
    }
};

export const unlikePostThunk = (id: string, userId: string) => {
    return async () => {
        try {
            const response = await unlikePostApi(id, userId);
            return response;
        } catch (error) {
            console.log(error, 'error on unliking comment');
            throw error
        }
    }
}



export const addCommentThunk = ({ postId, content, userId }: AddCommentArgs) => {
  return async () => {
   try {
    const response = await commentPostApi({postId, content, userId});
    return response.data;
   } catch (error) {
    console.log(error, 'this is error on commenting');
    throw error
   }
  };
};