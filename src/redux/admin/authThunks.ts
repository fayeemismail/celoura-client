import { adminRefreshAccessToken, getAllUsers } from "../../api/admin/adminApi";
import { adminLogin, logoutAdmin } from "../../api/auth";
import { signInFailure, signInPending, signInSuccess, signOut } from "./adminSlice";


export const handleAdminLogin = ( formData: { email: string, password: string } ) => {
    return async (dispatch: any) => {
        try {
            dispatch(signInPending());

            const response = await adminLogin(formData);

            dispatch(signInSuccess(response));

        } catch (error: any) {
            console.log(error.response?.data?.error);
            dispatch(signInFailure(error.response?.data.error || 'Login failed'))
        }
    }
}




export const handleAdminTokenRefresh = (): any => {
    return async (dispatch: any, getState: any) => {
        try {
            const state = getState();
            const currentAdmin = state.admin?.currentAdmin;

            if(!currentAdmin) {
                console.warn('No current admin found in Redux. Logging out...');
                await logoutAdmin();
                dispatch(signOut());
                return;
            }

            await adminRefreshAccessToken();
        } catch (error: any) {
            console.error('Admin token refresh failed', error.response?.data?.error);
            dispatch(signOut());
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
            const Users = await getAllUsers();
            await adminRefreshAccessToken();
            return Users.data;
        } catch (error) {
            console.error('something wrong with fetching data', error);;
            dispatch(signOut())
        }
    }
}