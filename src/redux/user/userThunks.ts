// /redux/user/userThunks.ts
import { getCurrentUser, refreshAccessToken } from "../../api/auth";
import { editProfile } from "../../api/userAPI";
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
      await refreshAccessToken();
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
