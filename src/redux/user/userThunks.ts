// /redux/user/userThunks.ts
import { 
  getCurrentUser, 
} from "../../api/auth";
import { editProfile, getDestinationsApi, singleSpotApi } from "../../api/userAPI";
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
      await editProfile(payload);
      const { data: userData } = await getCurrentUser();
      dispatch(updateUserSuccess(userData));
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || "Failed to update profile";

      if (status === 403 || error?.response?.data?.blocked) {
        dispatch(signOut());
      }

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
