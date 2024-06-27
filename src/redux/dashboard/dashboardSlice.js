import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name:"dashboard",
    initialState:{
        dashboard: {
            dashboard:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getDashboardStart: (state)=>{
            state.dashboard.isFetching = true;
        },
        getDashboardSuccess: (state,action) =>{
            state.dashboard.isFetching = false;
            state.dashboard.dashboard = action.payload;
        },
        getDashboardFailed: (state) => {
            state.dashboard.isFetching = false;
            state.dashboard.error = true;
        },
        clearDashboard: (state) =>{
            state.dashboard.dashboard = null;
        },
    }
})

export const {
    getDashboardStart,
    getDashboardSuccess,
    getDashboardFailed,
    clearDashboard
} = dashboardSlice.actions;

export default dashboardSlice.reducer;