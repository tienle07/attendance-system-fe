import axios from "axios";
import { getaddresssFailed, getaddresssStart, getaddresssSuccess, getDistrictFailed, getDistrictStart, getDistrictSuccess, getWardFailed, getWardStart, getWardSuccess } from "./addressSlice";
const url = process.env.PUBLIC_URL;

export const getProvince = async (accessToken,dispatch,axiosJWT) => {
    dispatch(getaddresssStart());
    try {
      const res = await axiosJWT.get("/api/address/provinces", {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      });
      dispatch(getaddresssSuccess(res.data.data));
    } catch (err) {
        dispatch(getaddresssFailed())
    }
};
export const getDistrict = async (accessToken,dispatch,code) => {
    dispatch(getDistrictStart());
    try {
      let  url1 = "/api/address/districts/"+code;
      const res = await axios.get(url1, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      });
      dispatch(getDistrictSuccess(res.data.data));
    } catch (err) {
        dispatch(getDistrictFailed(err))
    }
};
export const getWard = async (accessToken,dispatch,code) => {
    dispatch(getWardStart());
    try {
      let  url1 = "/api/address/wards/"+code;
      const res = await axios.get(url1, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      },code);
      dispatch(getWardSuccess(res.data.data));
    } catch (err) {
        dispatch(getWardFailed(err))
    }
};