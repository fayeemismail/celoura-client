import { adminRefreshAccessToken, BlockUser, createDestinationApi, deleteDestinationApi, getAllCount, getAllUsers, getAppliesGuide, getDestinationById, getDestinationsApi, guideApproveApi, guideRejectApi, pageinatedDestinations, unBlockUser, updateDestinationApi } from "../../api/admin/adminApi";
import { adminLogin, logoutAdmin } from "../../api/auth";
import { signInFailure, signInPending, signInSuccess, signOut } from "./adminSlice";


export const handleAdminLogin = ( formData: { email: string, password: string } ) => {
    return async (dispatch: any) => {
        try {
            dispatch(signInPending());

            const response = await adminLogin(formData);

            dispatch(signInSuccess(response));

        } catch (error: any) {
            console.log(error.response?.data?.message);
            dispatch(signInFailure(error.response?.data?.message || 'Login failed'))
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
    return async () => {
        try {
            const response = isCurrentlyBlocked ?
            await unBlockUser(userId) :
            await BlockUser(userId)
            return response
        } catch (error) {
            console.error('Something went wrong with user block un block', error);
        }
    }
}


export const GetAllUsersData = (page = 1, limit = 10, role: 'user' | 'guide' = 'user', search: string) => {
  return async () => {
    try {
      const response = await getAllUsers(page, limit, role, search);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
};

export const GetUserGuideCount = () => {
    return async () => {
        try {
            const response = await getAllCount();
            return response.data;
        } catch (error) {
            console.error('Error fetching users count: ', error);
        }
    } 
}

export const GetAllGuideApplications = (page: number, limit: number) => {
  return async (dispatch: any) => {
    try {
      const response = await getAppliesGuide(page, limit);

      return response.data;
    } catch (error: any) {
      console.error('Error on get applications', error);
      dispatch(signOut());
      throw error; 
    }
  };
};



export const ApproveAsGuide = (applicationId: string, userId: string) => {
    return async( ) => {
        try {
            const response = await guideApproveApi(applicationId, userId);
            return response;
        } catch (error) {
            console.log('Error On approve as guide', error);
            throw error;
        }
    }
};

export const RejectAsGuide = (applicationId: string, userId: string) => {
    return async() => {
        try {
            const response = await guideRejectApi(applicationId, userId);
            return response;
        } catch (error: any) {
            console.log('Error on Rejects as guide', error.message);
            throw error
        }
    }
}

export const createDestination = (formData: FormData) => {
  return async () => {
    try {
      const response = await createDestinationApi(formData);
      return response;
    } catch (error: any) {
      console.error('Error On Create Destination:', error.response?.data?.message || error.message);
      throw error;
    }
  };
};

export const getAllDestinations = () => {
    return async () => {
        try {
            const response = await getDestinationsApi();
            return response.data
        } catch (error: any) {
            console.error('Error on Getting Destinations: ', error.response);
            throw error
        }
    }
}


export const getAllPaginatedDesti = (page = 1, limit = 9, search = "", attraction = "") => {
    return async() => {
        try {
            const response = await pageinatedDestinations(page, limit, search, attraction);
            return response.data
        } catch (error: any) {
            console.error('Error on Getting paginated: ', error.message);
            throw error
        }
    }
};


export const deleteDestinationThunk = (destinationId: string) => {
    return async() => {
        try {
            const response = await deleteDestinationApi(destinationId);
            return response.data;
        } catch (error) {
            console.log(error);
            throw error
        }
    };
};


export const getDestinationByIdThunk = (destinationId: string) => {
    return async() => {
        try {
            const data = await getDestinationById(destinationId);
            return data.data
        } catch (error: unknown) {
            if(error instanceof Error){
                console.log(error.message);
                throw error
            } else {
                console.log(error)
                throw error
            }
        }
    };
};


export const updateDestinationThunk = (id: string, formData: FormData) => {
    return async() => {
        try {
            const response = await updateDestinationApi(id, formData);
            return response.data
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}
