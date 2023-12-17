import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    isLoading: false,
    error: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.isLoading = true;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.isLoading = true;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
    }
})

export const { signInStart, signInSuccess, signInFailure, updateStart, updateSuccess, updateFailure } = userSlice.actions;

export default userSlice.reducer;