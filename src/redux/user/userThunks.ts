import { editProfile, getCurrentUser, refreshAccessToken } from "../../api/auth";
import { UpdateProfilePayload } from "../../types/user";
import { parseAxiosError } from "../../utils/parseAxiosError";
import { AppDispatch } from "../store";
import { updateUserFailure, updateUserPending, updateUserSuccess } from "./userSlice";







export const handleUpdateProfile = (payload: UpdateProfilePayload) => {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(updateUserPending());
        await editProfile(payload);
        await refreshAccessToken(); // Ensure token refresh after password update
        const { data: userData } = await getCurrentUser();
        dispatch(updateUserSuccess(userData)); // Or however the response looks
      } catch (error: unknown) {
        const message = parseAxiosError(error);
        console.error('Update profile failed:', error);
        dispatch(updateUserFailure(message));
      }
    };
  };