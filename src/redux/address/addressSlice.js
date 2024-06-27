import { createSlice } from "@reduxjs/toolkit";

const addressSlice = createSlice({
    name:"address",
    initialState:{
        addresss: {
            allAddress:null,
            isFetching:false,
            error:false,
        },
        district: {
            isFetching:false,
            error:false,
            district:null,
        },
        ward: {
            isFetching:false,
            error:false,
            ward:null,
        },
        msg:"",
    },
    reducers:{
        getaddresssStart: (state)=>{
            state.addresss.isFetching = true;
        },
        getDistrictStart: (state)=>{
            state.district.isFetching = true;
        },
        getWardStart: (state)=>{
            state.ward.isFetching = true;
        },
        getaddresssSuccess: (state,action) =>{
            state.addresss.isFetching = false;
            state.addresss.alladdresss = action.payload;
        },
        getProvinceSuccess: (state,action) =>{
            state.addresss.isFetching = false;
            state.addresss.alladdresss = action.payload;
        },
        getDistrictSuccess: (state,action) =>{
            state.district.isFetching = false;
            state.district.district = action.payload;
        },
        getWardSuccess: (state,action) =>{
            state.ward.isFetching = false;
            state.ward.ward = action.payload;
        },
        getaddresssFailed: (state) => {
            state.addresss.isFetching = false;
            state.addresss.error = true;
        },
        getDistrictFailed: (state,action) => {
            state.district.isFetching = false;
            state.district.error = true;
        },
        getWardFailed: (state) => {
            state.ward.isFetching = false;
            state.ward.error = true;
        },
        deleteaddressStart: (state)=>{
            state.addresss.isFetching = true;
        },
        deleteaddresssSuccess: (state,action)=>{
            state.addresss.isFetching = false;
            state.msg = action.payload;
        },
        deleteaddressFailed: (state,action)=>{
            state.addresss.isFetching = false;
            state.addresss.error = true;
            state.msg = action.payload;
        } 
    }
})

export const {
    getaddresssStart,
    getDistrictStart,
    getWardStart,
    getaddresssSuccess,
    getaddresssFailed,
    getDistrictSuccess,
    getWardSuccess,
    getProvinceSuccess,
    getDistrictFailed,
    getWardFailed,
    deleteaddressStart,
    deleteaddresssSuccess,
    deleteaddressFailed
} = addressSlice.actions;

export default addressSlice.reducer;