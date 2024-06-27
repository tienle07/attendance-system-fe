import { createSlice } from "@reduxjs/toolkit";

const workscheduleSlice = createSlice({
    name:"workschedule",
    initialState:{
        workschedule: {
            schedule:null,
            isFetching:false,
            error:false
        },
        workscheduleWithPaging: {
            schedule:null,
            metadata:null,
            isFetching:false,
            error:false
        },
        workscheduletemplate: {
            template:null,
            isFetching:false,
            error:false
        },
        workshift:{
            shift:null,
            curshift:null,
            isFetching:false,
            error:false
        },
        msg:"",
    },
    reducers:{
        getworkscheduleStart: (state)=>{
            state.workschedule.isFetching = true;
        },
        getworkscheduleFails: (state)=>{
            state.workschedule.error = true;
            state.workschedule.isFetching = false;
        },
        getworkscheduleSuccess: (state,action) =>{
            state.workschedule.schedule = action.payload;
            state.workschedule.isFetching = false;
        },
        getworkschedulePagingStart: (state)=>{
            state.workscheduleWithPaging.isFetching = true;
        },
        getworkschedulePagingFails: (state)=>{
            state.workscheduleWithPaging.error = true;
            state.workscheduleWithPaging.isFetching = false;
        },
        getworkschedulePagingSuccess: (state,action) =>{
            state.workscheduleWithPaging.schedule = action.payload;
            state.workscheduleWithPaging.isFetching = false;
        },
        getworkscheduleMetadataSuccess: (state,action) =>{
            state.workscheduleWithPaging.metadata = action.payload;
            state.workscheduleWithPaging.isFetching = false;
        },
        getworkscheduleTemplateStart: (state)=>{
            state.workscheduletemplate.isFetching = true;
        },
        getworkscheduleTemplateFails: (state)=>{
            state.workscheduletemplate.error = true;
            state.workscheduletemplate.isFetching = false;
        },
        getworkscheduleTemplateSuccess: (state,action) =>{
            state.workscheduletemplate.template = action.payload;
            state.workscheduletemplate.isFetching = false;
        },
        getworkshiftStart: (state)=>{
            state.workshift.isFetching = true;
        },
        getworkshiftFails: (state)=>{
            state.workshift.error = true;
            state.workshift.isFetching = false;
        },
        getworkshiftSuccess: (state,action) =>{
            state.workshift.shift = action.payload;
            state.workshift.isFetching = false;
        },getworkshiftDetailStart: (state)=>{
            state.workshift.isFetching = true;
        },
        getworkshiftDetailFails: (state)=>{
            state.workshift.error = true;
            state.workshift.isFetching = false;
        },
        getworkshiftDetailSuccess: (state,action) =>{
            state.workshift.curshift = action.payload;
            state.workshift.isFetching = false;
        },
        clearWorkSchedule: (state) =>{
            state.workschedule.schedule = null;
            state.workshift.shift = null;
        }, 
    }
})

export const {
    getworkscheduleFails,
    getworkscheduleStart,
    getworkscheduleSuccess,
    getworkschedulePagingFails,
    getworkschedulePagingStart,
    getworkschedulePagingSuccess,
    getworkscheduleMetadataSuccess,
    getworkscheduleTemplateFails,
    getworkscheduleTemplateStart,
    getworkscheduleTemplateSuccess,
    getworkshiftFails,
    getworkshiftStart,
    getworkshiftSuccess,
    getworkshiftDetailFails,
    getworkshiftDetailSuccess,
    getworkshiftDetailStart,
    clearWorkSchedule
} = workscheduleSlice.actions;

export default workscheduleSlice.reducer;