// /redux/user/userThunks.ts
import { editProfile, getAllGuidesOnUserApi, getCurrentMe, getDestinationsApi, getNewDestinationApi, pageinatedDestiUserApi, singleSpotApi } from "../../api/userAPI";
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
} 