import { login } from "../../infrastructure/api/auth";
import { signInFailure, signInPending, signInSuccess, signOut } from "./userSlice";


// handleLogin function authThunks
export const handleLogin = ( formData: { email: string; password: string } ) => {
    return async ( dispatch: any ) => {
        try {
            dispatch(signInPending());

            const response = await login(formData);
            console.log(response.user, 'THIS IS CURRENTuSER')

            //access token setting
            localStorage.setItem('accessToken', response.token);

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
            
            dispatch(signOut());
            localStorage.removeItem('accessToken');

        } catch (error: any) {
            console.log(error)
        }
    }
}