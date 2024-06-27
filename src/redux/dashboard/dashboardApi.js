import { getDashboardFailed, getDashboardStart, getDashboardSuccess } from "./dashboardSlice";

export const getDashboardHr = async (accessToken, dispatch,axiosJWT) => {
    dispatch(getDashboardStart());
    try {
      const res = await axiosJWT.get("/api/dashboard/hr-get-dashboard", {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getDashboardSuccess(res.data.data));
    } catch (err) {
      dispatch(getDashboardFailed());
    }
};
export const getDashboardStoreManager = async (id,accessToken, dispatch,axiosJWT) => {
    dispatch(getDashboardStart());
    try {
      const res = await axiosJWT.get("/api/dashboard/store-manager-get-dashboard/"+id, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getDashboardSuccess(res.data.data));
    } catch (err) {
      dispatch(getDashboardFailed());
    }
};