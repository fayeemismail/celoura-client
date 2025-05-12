import { guideLogin, logoutGuide } from "../../api/auth";
import { getMyDetails, guideRefreshAccessToken } from "../../api/guide/guideApi";
import { signInFailure, signInPending, signInSuccess, signOut } from "./guideSlice"




export const handleGuideLogin = ( formData: { email: string, password: string } ) => {
    return async (dispatch: any) => {
        try {
            dispatch(signInPending());

            const response = await guideLogin(formData);

            dispatch(signInSuccess(response));

        } catch (error: any) {
            console.log(error.response?.data?.error);
            dispatch(signInFailure(error.response?.data?.error || "Login failed"));
        }
    }
};



export const handleGuideTokenRefresh = (): any => {
    return async (dispatch: any, getState: any) => {
        try {
            const state = getState();
            const currentGuide = state.guide?.currentGuide;

            if(!currentGuide) {
                console.warn('No current guide found in Redux. Logging out...');
                await logoutGuide();
                dispatch(signOut());
                return 
            }

            await guideRefreshAccessToken()
        } catch (error: any) {
            console.error('Guide token refresh faied:', error.response?.data?.error);
            dispatch(signOut())
        }
    }
}


export const handleGuideLogout = () => {
    return async (dispatch: any) => {
        try {
            
            await logoutGuide();

            dispatch(signOut());
        } catch (error: any) {
            console.log(error)
        }
    }
};




export const getMe = (id: string) => {
    return async (dispatch: any) => {
        try {
            const Users = await getMyDetails(id);
            await guideRefreshAccessToken();
            return Users.data;
        } catch (error) {
            console.error('something wrong with fetching data', error);;
            dispatch(signOut())
        }
    }
}