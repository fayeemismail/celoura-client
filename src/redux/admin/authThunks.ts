import { adminRefreshAccessToken, BlockUser, getAllCount, getAllUsers, getAppliesGuide, guideApproveApi, guideRejectApi, unBlockUser } from "../../api/admin/adminApi";
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


export const handleUserBlockUnblock = (userId: string, isCurrentlyBlocked: boolean) => {
    return async (dispatch: any) => {
        try {
            const response = isCurrentlyBlocked ?
            await unBlockUser(userId) :
            await BlockUser(userId)
            await adminRefreshAccessToken();
            return response
        } catch (error) {
            console.error('Something went wrong with user block un block', error);
            dispatch()
        }
    }
}


export const GetAllUsersData = (page = 1, limit = 10, role: 'user' | 'guide' = 'user') => {
  return async (dispatch: any) => {
    try {
      const response = await getAllUsers(page, limit, role);
      await adminRefreshAccessToken();
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch();
    }
  };
};

export const GetUserGuideCount = () => {
    return async (dispatch: any) => {
        try {
            const response = await getAllCount();
            await adminRefreshAccessToken();
            return response.data;
        } catch (error) {
            console.error('Error fetching users count: ', error);
            dispatch()
        }
    } 
}

export const GetAllGuideApplications = (page: number, limit: number) => {
  return async (dispatch: any) => {
    try {
      const response = await getAppliesGuide(page, limit);
      await adminRefreshAccessToken();

      return response.data;
    } catch (error: any) {
      console.error('Error on get applications', error);
      dispatch(signOut());
      throw error; 
    }
  };
};



export const ApproveAsGuide = (applicationId: string, userId: string) => {
    return async( dispatch: any ) => {
        try {
            const response = await guideApproveApi(applicationId, userId);
            await adminRefreshAccessToken();
            return response;
        } catch (error) {
            console.log('Error On approve as guide', error);
            dispatch();
        }
    }
};

export const RejectAsGuide = (applicationId: string, userId: string) => {
    return async(dispatch: any) => {
        try {
            const response = await guideRejectApi(applicationId, userId);
            await adminRefreshAccessToken();
            return response;
        } catch (error: any) {
            console.log('Error on Rejects as guide', error.message);
            dispatch()
        }
    }
}