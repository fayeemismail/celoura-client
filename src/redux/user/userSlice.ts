import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";



export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async( userId, { rejectWithValue } ) => {
        try {
            const response = await fetch(`/api/user/${userId}`);
            if( !response.ok ){
                throw new Error('Failed to fetch user Data');
            };
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message)
        }
    }
)



interface CurrentUser {
    id: string,
    name: string,
    email: string,
    role: string
}

interface UserState {
    currentUser: CurrentUser | null;
    loading: boolean;
    error: string | null | boolean;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    currentUser: null,
    loading: false,
    error: null,
    isAuthenticated: false
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.currentUser = action.payload;
            state.isAuthenticated = true
        },
        signInPending(state) {
            state.loading = true
        },
        signInSuccess(state, action: PayloadAction<CurrentUser>) {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
            state.isAuthenticated = true;
        },
        signInFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },

        updateUserPending(state) {
            state.loading = true;           
        },
        updateUserSuccess(state, action: PayloadAction<CurrentUser>) {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false
        },
        updateUserFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },

        deleteUserPending(state) {
            state.loading = true
        },
        deleteUserSuccess(state) {
            state.currentUser = null
            state.loading = false;
            state.error = false ;
            state.isAuthenticated = false;
        },
        deletUserFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload
        },

        signOut(state) {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
            state.isAuthenticated = false;
        },
        clearError(state) {
            state.error = null;
        },

    },
    extraReducers: (builder) => {
        builder 
        .addCase(fetchUserData.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchUserData.fulfilled, (state, action: PayloadAction<CurrentUser>) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
            state.isAuthenticated = true;
        })
        .addCase(fetchUserData.rejected, (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        })
    }
});


export const {
    setUser,
    signInPending,
    signInSuccess,
    signInFailure,
    updateUserPending,
    updateUserSuccess,
    updateUserFailure,
    signOut,
    deleteUserPending,
    deletUserFailure,
    deleteUserSuccess,
    clearError
} = userSlice.actions;

export default userSlice.reducer;