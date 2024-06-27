import { createSlice } from "@reduxjs/toolkit";

const employeeSlice = createSlice({
    name:"employee",
    initialState:{
        employees: {
            allEmployees:null,
            isFetching:false,
            error:false
        },
        currentSelectEmployee:{
            curEmployee:null,
            isFetching:false,
            error:false
        },
        employeeType:{
            type:null,
            isFetching:false,
            error:false
        },
        employeePosition:{
            position:null,
            isFetching:false,
            error:false
        },
        promoteList:{
            list:null,
            isFetching:false,
            error:false
        },
        listToAddToStore:{
            listAdd:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getemployeesStart: (state)=>{
            state.employees.isFetching = true;
        },
        getemployeesSuccess: (state,action) =>{
            state.employees.isFetching = false;
            state.employees.allEmployees = action.payload;
        },
        getemployeesFailed: (state) => {
            state.employees.isFetching = false;
            state.employees.error = true;
        },
        getPromoteEmployeeListStart: (state)=>{
            state.promoteList.isFetching = true;
        },
        getPromoteEmployeeListSuccess: (state,action) =>{
            state.promoteList.isFetching = false;
            state.promoteList.error = false;
            state.promoteList.list = action.payload;
        },
        getPromoteEmployeeListFailed: (state) => {
            state.promoteList.isFetching = false;
            state.promoteList.error = true;
        },
        getCurEmployeesStart: (state)=>{
            state.currentSelectEmployee.isFetching = true;
        },
        getCurEmployeesSuccess: (state,action) =>{
            state.currentSelectEmployee.isFetching = false;
            state.currentSelectEmployee.curEmployee = action.payload;
        },
        getCurEmployeesFailed: (state) => {
            state.currentSelectEmployee.isFetching = false;
            state.currentSelectEmployee.error = true;
        },
        deleteemployeeStart: (state)=>{
            state.employees.isFetching = true;
        },
        deleteemployeesSuccess: (state,action)=>{
            state.employees.isFetching = false;
            state.msg = action.payload;
        },
        deleteemployeeFailed: (state,action)=>{
            state.employees.isFetching = false;
            state.employees.error = true;
            state.msg = action.payload;
        },
        getTypeStart: (state)=>{
            state.employeeType.isFetching = true;
        },
        getTypeSuccess: (state,action) =>{
            state.employeeType.isFetching = false;
            state.employeeType.type = action.payload;
        },
        getTypeFailed: (state) => {
            state.employeeType.isFetching = false;
            state.employeeType.error = true;
        },
        getPositionStart: (state)=>{
            state.employeePosition.isFetching = true;
        },
        getPositionSuccess: (state,action) =>{
            state.employeePosition.isFetching = false;
            state.employeePosition.position = action.payload;
        },
        getPositionFailed: (state) => {
            state.employeePosition.isFetching = false;
            state.employeePosition.error = true;
        },
        getListAddToStoreStart: (state)=>{
            state.listToAddToStore.isFetching = true;
        },
        getListAddToStoreSuccess: (state,action) =>{
            state.listToAddToStore.isFetching = false;
            state.listToAddToStore.listAdd = action.payload;
        },
        getListAddToStoreFailed: (state) => {
            state.listToAddToStore.isFetching = false;
            state.listToAddToStore.error = true;
        },
        editemployeeStart: (state)=>{
            state.employees.isFetching = true;
        },
        editemployeesSuccess: (state)=>{
            state.employees.isFetching = false;
        },
        editemployeeFailed: (state,action)=>{
            state.employees.isFetching = false;
            state.employees.error = true;
            state.msg = action.payload;
        },
        clearEmployee: (state) =>{
            state.listToAddToStore.listAdd = null;
            state.promoteList.list = null;
            state.currentSelectEmployee.curEmployee = null;
            state.employees.allEmployees = null;
            state.employeePosition.position =null;
            state.employeeType.type = null;
        }, 
    }
})

export const {
    getemployeesStart,
    getemployeesSuccess,
    getemployeesFailed,
    getPromoteEmployeeListStart,
    getPromoteEmployeeListSuccess,
    getPromoteEmployeeListFailed,
    getCurEmployeesFailed,
    getCurEmployeesStart,
    getCurEmployeesSuccess,
    deleteemployeeStart,
    deleteemployeesSuccess,
    deleteemployeeFailed,
    editemployeeStart,
    editemployeesSuccess,
    editemployeeFailed,
    getTypeStart,
    getTypeSuccess,
    getTypeFailed,
    getPositionStart,
    getPositionSuccess,
    getPositionFailed,
    getListAddToStoreFailed,
    getListAddToStoreStart,
    getListAddToStoreSuccess,
    clearEmployee
} = employeeSlice.actions;

export default employeeSlice.reducer;