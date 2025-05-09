import { editProfile, getCurrentUser, login, logoutUser, refreshAccessToken } from "../../api/auth";
import { UpdateProfilePayload } from "../../types/user";
import { parseAxiosError } from "../../utils/parseAxiosError";
import { AppDispatch } from "../store";
import { signInFailure, signInPending, signInSuccess, signOut, updateUserPending, updateUserSuccess, updateUserFailure } from "./userSlice";


// handleLogin function authThunks
export const handleLogin = ( formData: { email: string; password: string } ) => {
    return async ( dispatch: any ) => {
        try {
            dispatch(signInPending());

            const response = await login(formData);
            console.log(response, 'THIS IS CURRENTuSER')



            dispatch(signInSuccess(response));

        } catch (error: any) {
            console.log(error.response?.data?.error);
            dispatch(signInFailure(error.response?.data?.error || "Login failed" ));
        }
    }
}


export const handleSignout = () => {
    return async (dispatch: any) => {
        try {

            await logoutUser();
            
            dispatch(signOut());

        } catch (error: any) {
            console.log(error)
        }
    }
}


export const handleTokenRefresh = (): any => {
    return async (dispatch: any, getState: any) => {
        try {

            const state = getState();
            const currentUser = state.auth?.user || state.user?.currentUser;

            if (!currentUser) {
                console.warn('No current user found in Redux. Logging out...');
                await logoutUser()
                dispatch(signOut());
                return;
            }
            await refreshAccessToken();
        } catch (error: any) {
            console.error('Refresh token failed', error.response?.data?.error);
            dispatch(signOut());
        }
    }
}




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