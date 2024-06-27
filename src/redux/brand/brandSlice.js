import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
    name:"brand",
    initialState:{
        brand: {
            allBrands:null,
            isFetching:false,
            error:false
        },
        currentBrandSelect:{
            curBrand:null,
            isFetching:false,
            error:false
        },
        timeFrame:{
            frame:null,
            isFetching:false,
            error:false
        },
        currentFrame:{
            curFrame:null,
            isFetching:false,
            error:false
        },
        brandconfig:{
            config:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getbrandsStart: (state)=>{
            state.brand.isFetching = true;
        },
        getbrandsSuccess: (state,action) =>{
            state.brand.isFetching = false;
            state.brand.allBrands = action.payload;
        },
        getbrandsFailed: (state) => {
            state.brand.isFetching = false;
            state.brand.error = true;
        },
        getCurBrandStart: (state)=>{
            state.currentBrandSelect.isFetching = true;
        },
        getCurBrandSuccess: (state,action) =>{
            state.currentBrandSelect.isFetching = false;
            state.currentBrandSelect.curBrand = action.payload;
        },
        getCurBrandFailed: (state) => {
            state.currentBrandSelect.isFetching = false;
            state.currentBrandSelect.error = true;
        },
        getTimeFramesStart: (state)=>{
            state.timeFrame.isFetching = true;
        },
        getTimeFramesSuccess: (state,action) =>{
            state.timeFrame.isFetching = false;
            state.timeFrame.frame = action.payload;
        },
        getTimeFramesFailed: (state) => {
            state.timeFrame.isFetching = false;
            state.timeFrame.error = true;
        },
        getCurTimeFrameStart: (state)=>{
            state.currentFrame.isFetching = true;
        },
        getCurTimeFrameSuccess: (state,action) =>{
            state.currentFrame.isFetching = false;
            state.currentFrame.curFrame = action.payload;
        },
        getCurTimeFrameFailed: (state) => {
            state.currentFrame.isFetching = false;
            state.currentFrame.error = true;
        },
        getConfigStart: (state)=>{
            state.brandconfig.isFetching = true;
        },
        getConfigSuccess: (state,action) =>{
            state.brandconfig.isFetching = false;
            state.brandconfig.config = action.payload;
        },
        getConfigFailed: (state) => {
            state.brandconfig.isFetching = false;
            state.brandconfig.error = true;
        },
        clearBrand: (state) =>{
            state.brand.allBrands = null;
            state.currentBrandSelect.curBrand = null;
            state.currentFrame.curFrame = null;
            state.timeFrame.frame = null;
            state.brandconfig.config = null;
        },
    }
})

export const {
    getbrandsStart,
    getbrandsSuccess,
    getbrandsFailed,
    getCurBrandFailed,
    getCurBrandStart,
    getCurBrandSuccess,
    getCurTimeFrameFailed,
    getCurTimeFrameStart,
    getCurTimeFrameSuccess,
    getTimeFramesFailed,
    getTimeFramesStart,
    getTimeFramesSuccess,
    getConfigFailed,
    getConfigStart,
    getConfigSuccess,
    clearBrand
} = brandSlice.actions;

export default brandSlice.reducer;