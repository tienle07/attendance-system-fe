import axios from "axios";
import { clearApplication, getApplicationsFailed, getApplicationsStart, getApplicationsSuccess, getSelectedApplicationsFailed, getSelectedApplicationsStart, getSelectedApplicationsSuccess, getTypeFailed, getTypeStart, getTypeSuccess } from "./ticketSlice";

export const getAllApplication = async (accessToken, dispatch) => {
    dispatch(getApplicationsStart());
    try {
      const res = await axios.get("/api/employeeapplication/manager-get-list-application", {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getApplicationsSuccess(res.data.data));
    } catch (err) {
      dispatch(clearApplication());
      dispatch(getApplicationsFailed());
    }
  };
  export const getAllApplicationInStore = async (id,accessToken, dispatch) => {
    dispatch(getApplicationsStart());
    try {
      const res = await axios.get("/api/application/manager-get-store-applications/" +id, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getApplicationsSuccess(res.data.data));
    } catch (err) {
      dispatch(clearApplication());
      dispatch(getApplicationsFailed());
    }
  };
  export const getSelectedApplicationDetails = async (id,accessToken, dispatch) => {
    dispatch(getSelectedApplicationsStart());
    try { 
      const res = await axios.get("/api/application/get-application-detail/" +id, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getSelectedApplicationsSuccess(res.data.data));
    } catch (err) {
      dispatch(clearApplication());
      dispatch(getSelectedApplicationsFailed());
    }
  };
export const getTypeOfApplication = async (accessToken, dispatch) => {
    dispatch(getTypeStart());
    try {
      const res = await axios.get("/api/applicationtype/get-type-list", {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getTypeSuccess(res.data.data));
    } catch (err) {
      dispatch(getTypeFailed());
    }
  };