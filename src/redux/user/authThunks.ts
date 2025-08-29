import {  changeForgotPasswordAPI, forgotPassVerifyOTPAPI, forgotPasswordRequestAPI, login, logoutUser, refreshAccessToken, resentForgotPasswordOtpAPI } from "../../api/auth";
import { signInFailure, signInPending, signInSuccess, signOut } from "./userSlice";



export const handleLogin = ( formData: { email: string; password: string } ) => {
    return async ( dispatch: any ) => {
        try {
            dispatch(signInPending());

            const response = await login(formData);
            console.log(response, 'THIS IS CURRENTuSER')



            dispatch(signInSuccess(response));

        } catch (error: any) {
            console.log(error.response?.data?.message);
            dispatch(signInFailure(error.response?.data?.message || "Login failed" ));
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


export const forgotPasswordRequest = (email: string) => {
    return async() => {
        try {
            const response = await forgotPasswordRequestAPI(email);
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
} ;

export const forgotPassVerifyOtp = (email: string, otp: string) => {
    return async() => {
        try {
            const response = await forgotPassVerifyOTPAPI(email, otp);
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};


export const resentForgotPasswordOtpThunk = (email: string) => {
    return async() => {
        try {
            const response = await resentForgotPasswordOtpAPI(email);
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
};

export const changeForgotPasswordThunk = (email: string, newPassword: string) => {
    return async() => {
        try {
            const response = await changeForgotPasswordAPI(email, newPassword);
            return response.data
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}
