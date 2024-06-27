import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name:"application",
    initialState:{
        application: {
            allApplication:null,
            isFetching:false,
            error:false
        },
        selectedApplication:{
            application:null,
            isFetching:false,
            error:false
        },
        typeofapplication:{
            type:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getApplicationsStart: (state)=>{
            state.application.isFetching = true;
        },
        getApplicationsSuccess: (state,action) =>{
            state.application.isFetching = false;
            state.application.allApplication = action.payload;
        },
        getApplicationsFailed: (state) => {
            state.application.isFetching = false;
            state.application.error = true;
        },
        getSelectedApplicationsStart: (state)=>{
            state.selectedApplication.isFetching = true;
        },
        getSelectedApplicationsSuccess: (state,action) =>{
            state.selectedApplication.isFetching = false;
            state.selectedApplication.application = action.payload;
        },
        getSelectedApplicationsFailed: (state) => {
            state.selectedApplication.isFetching = false;
            state.selectedApplication.error = true;
        },
        getTypeStart: (state)=>{
            state.typeofapplication.isFetching = true;
        },
        getTypeSuccess: (state,action) =>{
            state.typeofapplication.isFetching = false;
            state.typeofapplication.type = action.payload;
        },
        getTypeFailed: (state) => {
            state.typeofapplication.isFetching = false;
            state.typeofapplication.error = true;
        },
        clearApplication: (state) => {
            state.application.allApplication = null;
        },
    }
})

export const {
    getApplicationsStart,
    getApplicationsSuccess,
    getApplicationsFailed,
    getSelectedApplicationsFailed,
    getSelectedApplicationsStart,
    getSelectedApplicationsSuccess,
    getTypeFailed,
    getTypeStart,
    getTypeSuccess,
    clearApplication
} = applicationSlice.actions;

export default applicationSlice.reducer;