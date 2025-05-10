import { createSlice, PayloadAction } from "@reduxjs/toolkit";






interface Admin {
    id: string;
    name: string;
    email: string;
    role: 'admin';
};

interface AdminState {
    currentAdmin: Admin | null;
    loading: boolean;
    error: string | null | boolean;
    isAuthenticated: boolean;
};

const initialState: AdminState = {
    currentAdmin: null,
    loading: false,
    error: null,
    isAuthenticated: false
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        signInPending(state) {
            state.loading = true;
        },
        signInSuccess(state, action: PayloadAction<Admin>) {
            state.currentAdmin = action.payload;
            state.loading = false;
            state.error = false;
            state.isAuthenticated = true
        },
        signInFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
        },
        signOut(state) {
            state.currentAdmin = null;
            state.loading = false;
            state.error = false;
            state.isAuthenticated = false;
        },
        clearError(state) {
            state.error = null;
        }
    },

});


export const {
    signInPending,
    signInSuccess,
    signInFailure,
    signOut,
    clearError
} = adminSlice.actions;


export default adminSlice.reducer;