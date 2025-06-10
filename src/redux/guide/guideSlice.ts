import { createSlice, PayloadAction } from "@reduxjs/toolkit";



interface Guide {
    id: string;
    name: string;
    email: string;
    role: 'guide';
};

interface GuideState {
    currentGuide: Guide | null;
    loading: boolean;
    error: string | null | boolean;
    isAuthenticated: boolean;
};

const initialState : GuideState = {
    currentGuide: null,
    loading: false,
    error: null,
    isAuthenticated: false
};

const guideSlice = createSlice({
    name: 'guide',
    initialState, 
    reducers: {
        setGuide(state, action) {
            state.currentGuide = action.payload;
            state.isAuthenticated = true
        },
        signInPending(state) {
            state.loading = true
        },
        signInSuccess(state, action: PayloadAction<Guide>) {
            state.currentGuide = action.payload
            state.loading = false;
            state.error = false;
            state.isAuthenticated = true
        },
        signInFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            state.isAuthenticated = false
        },
        signOut(state) {
            state.currentGuide = null;
            state.loading = false;
            state.error = false;
            state.isAuthenticated = false
        },
        clearError(state) {
            state.error = null
        }
    },
});


export const {
    signInPending,
    signInSuccess,
    signInFailure,
    signOut,
    clearError,
    setGuide
} = guideSlice.actions;

export default guideSlice.reducer;