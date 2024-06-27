import { clearWorkSchedule, getworkscheduleFails, getworkscheduleMetadataSuccess, getworkschedulePagingFails, getworkschedulePagingStart, getworkschedulePagingSuccess, getworkscheduleStart, getworkscheduleSuccess, getworkscheduleTemplateFails, getworkscheduleTemplateStart, getworkscheduleTemplateSuccess, getworkshiftDetailStart, getworkshiftDetailSuccess, getworkshiftFails, getworkshiftStart, getworkshiftSuccess } from "./workscheduleSlice";
const url = process.env.PUBLIC_URL;
export const getWorkSchedule = async (id, dispatch,accessToken,axiosJWT) => {
    dispatch(getworkscheduleStart());
    try {
      const res = await axiosJWT.get("/api/workschedule/manager-get-schedules-in-store?StoreId="+id, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getworkscheduleSuccess(res.data.data));
    } catch (err) {
      dispatch(getworkscheduleFails());
      dispatch(clearWorkSchedule());
    }
};
export const getWorkScheduleWithPaging = async (id, dispatch,accessToken,axiosJWT,page,size) => {
    dispatch(getworkschedulePagingStart());
    try {
      const res = await axiosJWT.get(`/api/workschedule/manager-get-schedules-in-store?StoreId=${id}&Page=${page}&Size=${size}`, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getworkschedulePagingSuccess(res.data.data));
      dispatch(getworkscheduleMetadataSuccess(res.data.metaData));
    } catch (err) {
      dispatch(getworkschedulePagingFails());
      dispatch(clearWorkSchedule());
    }
};
export const getWorkScheduleTemplate = async (id, dispatch,accessToken,axiosJWT) => {
    dispatch(getworkscheduleTemplateStart());
    try {
      const res = await axiosJWT.get(`/api/workschedule/manager-get-schedules-in-store?StoreId=${id}&IsTemplate=true`, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getworkscheduleTemplateSuccess(res.data.data));
    } catch (err) {
      dispatch(getworkscheduleTemplateFails());
      dispatch(clearWorkSchedule());
    }
};
export const getWorkShift = async (id, dispatch,accessToken,axiosJWT) => {
    dispatch(getworkshiftStart());
    try {
      const res = await axiosJWT.get("/api/workschedule/manager-get-schedule-detail/"+id, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getworkshiftSuccess(res.data.data));
    } catch (err) {
      dispatch(getworkshiftFails());
    }
};
export const getShiftDetails = async (id, dispatch,accessToken,axiosJWT) => {
  dispatch(getworkshiftDetailStart());
  try {
    const res = await axiosJWT.get("/api/workshift/manager-get-shift-details/"+id, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getworkshiftDetailSuccess(res.data.data));
  } catch (err) {
    dispatch(getworkshiftSuccess());
  }
};
