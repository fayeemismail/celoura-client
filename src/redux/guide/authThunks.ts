import { guideLogin, logoutGuide } from "../../api/auth";
import { getMyDetails, getNewDestinationApi, getPaginatiedDestinationGuideAPI, guideRefreshAccessToken } from "../../api/guide/guideApi";
import { signInFailure, signInPending, signInSuccess, signOut } from "./guideSlice"




export const handleGuideLogin = ( formData: { email: string, password: string } ) => {
    return async (dispatch: any) => {
        try {
            dispatch(signInPending());

            const response = await guideLogin(formData);

            dispatch(signInSuccess(response));

        } catch (error: any) {
            console.log(error);
            dispatch(signInFailure(error.response?.data?.message || "Login failed"));
        }
    }
};


export const getPaginatedDestinationGuideThunk = (page: number, limit: number, search: string, attraction: string) => {
    return async() => {
        try {
            const response = await getPaginatiedDestinationGuideAPI(page, limit, search, attraction);
            console.log(response.data, 'this is data')
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}


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
};



export const getNewDestinationsThunk = (limit: number) => {
    return async() => {
        try {
            const res = await getNewDestinationApi(limit);
            return res.data
        } catch (error) {
            console.error("something went wrong on fetching destination", error);
            throw error
        }
    }
}