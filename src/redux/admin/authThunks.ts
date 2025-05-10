import { getAllUsers } from "../../api/adminApi";
import { adminLogin, logoutAdmin } from "../../api/auth";
import { signInFailure, signInPending, signInSuccess, signOut } from "./adminSlice";


export const handleAdminLogin = ( formData: { email: string, password: string } ) => {
    return async (dispatch: any) => {
        try {
            dispatch(signInPending());

            const response = await adminLogin(formData);

            dispatch(signInSuccess(response))

        } catch (error: any) {
            console.log(error.response?.data?.error);
            dispatch(signInFailure(error.response?.data.error || 'Login failed'))
        }
    }
}



export const handleAdminLogout = () => {
    return async (dispatch: any) => {
        try {

            await logoutAdmin();


            dispatch(signOut());
        } catch (error: any) {
            console.log(error)
        }
    }
};


export const GetAllUsersData = () => {
    return async (dispatch: any) => {
        try {
            const response = await getAllUsers();
            return response.data
        } catch (error) {
            console.error('something wrong with fetching data', error);;
            dispatch(signOut())
        }
    }
}