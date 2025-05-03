import { adminLogin } from "../../api/auth";
import { signInFailure, signInPending, signInSuccess } from "../user/userSlice"


export const handleAdminLogin = ( formData: { email: string, password: string } ) => {
    return async (dispatch: any) => {
        try {
            dispatch(signInPending());

            const response = await adminLogin(formData);
            console.log(response, 'this is admin');

            dispatch(signInSuccess(response))

        } catch (error: any) {
            console.log(error.response?.data?.error);
            dispatch(signInFailure(error.response?.data.error || 'Login failed'))
        }
    }
}