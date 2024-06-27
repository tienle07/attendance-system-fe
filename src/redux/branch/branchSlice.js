import { createSlice } from "@reduxjs/toolkit";

const branchSlice = createSlice({
    name:"branch",
    initialState:{
        branchs: {
            allBranchs:null,
            isFetching:false,
            error:false
        },
        currentBranchSelect:{
            curBranch:null,
            employeeInBranch:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getbranchsStart: (state)=>{
            state.branchs.isFetching = true;
        },
        getEmployeeInCurBranchStart: (state)=>{
            state.currentBranchSelect.isFetching = true;
        },
        getEmployeeInCurBranchSuccess: (state,action) =>{
            state.currentBranchSelect.isFetching = false;
            state.currentBranchSelect.employeeInBranch = action.payload;
        },
        getEmployeeInCurBranchFailed: (state)=>{
            state.currentBranchSelect.isFetching = false;
            state.currentBranchSelect.error = true;
        },
        getbranchsSuccess: (state,action) =>{
            state.branchs.isFetching = false;
            state.branchs.allBranchs = action.payload;
        },
        getbranchsFailed: (state) => {
            state.branchs.isFetching = false;
            state.branchs.error = true;
        },
        getCurBranchsStart: (state)=>{
            state.currentBranchSelect.isFetching = true;
        },
        getCurBranchsSuccess: (state,action) =>{
            state.currentBranchSelect.isFetching = false;
            state.currentBranchSelect.curBranch = action.payload;
        },
        getCurBranchsFailed: (state) => {
            state.currentBranchSelect.isFetching = false;
            state.currentBranchSelect.error = true;
        },
        deletebranchStart: (state)=>{
            state.branchs.isFetching = true;
        },
        deletebranchsSuccess: (state,action)=>{
            state.branchs.isFetching = false;
            state.msg = action.payload;
        },
        deletebranchFailed: (state,action)=>{
            state.branchs.isFetching = false;
            state.branchs.error = true;
            state.msg = action.payload;
        },
        clearBranch: (state) =>{
            state.branchs.allBranchs = null;
            state.currentBranchSelect.curBranch = null;
        },
    }
})

export const {
    getbranchsStart,
    getEmployeeInCurBranchStart,
    getEmployeeInCurBranchFailed,
    getEmployeeInCurBranchSuccess,
    getbranchsSuccess,
    getbranchsFailed,
    getCurBranchsStart,
    getCurBranchsSuccess,
    getCurBranchsFailed,
    deletebranchStart,
    deletebranchsSuccess,
    deletebranchFailed,
    clearBranch
} = branchSlice.actions;

export default branchSlice.reducer;