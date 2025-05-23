import {  getCurrentUser, refreshAccessToken } from "../../api/auth";
import { editProfile } from "../../api/userAPI";
import { UpdateProfilePayload } from "../../types/user";
import { AppDispatch } from "../store";
import { signOut, updateUserFailure, updateUserPending, updateUserSuccess } from "./userSlice";







export const handleUpdateProfile = (payload: UpdateProfilePayload) => {
    return async (dispatch: AppDispatch) => {
      try {
        dispatch(updateUserPending());
        await editProfile(payload);
        await refreshAccessToken(); 
        const { data: userData } = await getCurrentUser();
        dispatch(updateUserSuccess(userData));
      } catch (error: any) {
        const { status } = error.response || {};
        console.log(status)
        const message = error.response.data?.message
        if(status == 403 || error.response.data?.blocked){
          dispatch(signOut())
        }
        console.error('Update profile failed:',error.response.data?.message );
        dispatch(updateUserFailure(message));
      }
    };
};