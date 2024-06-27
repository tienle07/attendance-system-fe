import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null,
            isFetching: false,
            error: false
        },
        currentUserProfile: {
            userLoginProfile: null,
            isFetching: false,
            error: false
        },
        generateAccountForEmployee:{
            account: null,
            isFetching: false,
            error: false
        },
        logout: {
            isFetching: false,
            error: false
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload;
            state.login.error = false;
        },
        loginFailed: (state) => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        getCurUserLoginProfileStart: (state) => {
            state.currentUserProfile.isFetching = true;
        },
        getCurUserLoginProfileSuccess: (state, action) => {
            state.currentUserProfile.isFetching = false;
            state.currentUserProfile.userLoginProfile = action.payload;
            state.currentUserProfile.error = false;
        },
        getCurUserLoginProfileFailed: (state) => {
            state.currentUserProfile.isFetching = false;
            state.currentUserProfile.error = true;
        },
        generateAccountForEmployeeStart: (state) => {
            state.generateAccountForEmployee.isFetching = true;
        },
        generateAccountForEmployeeSuccess: (state, action) => {
            state.generateAccountForEmployee.isFetching = false;
            state.generateAccountForEmployee.account = action.payload;
            state.generateAccountForEmployee.error = false;
        },
        generateAccountForEmployeeFailed: (state) => {
            state.generateAccountForEmployee.isFetching = false;
            state.generateAccountForEmployee.error = true;
        },
        logoutStart: (state) => {
            state.logout.isFetching = true;
        },
        logoutSuccess: (state) => {
            state.logout.isFetching = false;
            state.login.currentUser = null;
            state.currentUserProfile.userLoginProfile = null;
            state.logout.error = false;
        },
        logoutFailed: (state) => {
            state.logout.isFetching = false;
            state.logout.error = true;
        },
    }
});
export const {
    loginStart,
    loginSuccess,
    loginFailed,
    getCurUserLoginProfileStart,
    getCurUserLoginProfileSuccess,
    getCurUserLoginProfileFailed,
    generateAccountForEmployeeStart,
    generateAccountForEmployeeSuccess,
    generateAccountForEmployeeFailed,
    logoutFailed,
    logoutStart,
    logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;