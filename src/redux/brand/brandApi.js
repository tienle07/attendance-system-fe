import axios from "axios";
import {
  getConfigFailed,
  getConfigStart,
  getConfigSuccess,
  getCurBrandFailed,
  getCurBrandStart,
  getCurBrandSuccess,
  getCurTimeFrameFailed,
  getCurTimeFrameStart,
  getCurTimeFrameSuccess,
  getTimeFramesFailed,
  getTimeFramesStart,
  getTimeFramesSuccess,
  getbrandsFailed,
  getbrandsStart,
  getbrandsSuccess,
} from "./brandSlice";

export const getAllBrand = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getbrandsStart());
  try {
    const res = await axiosJWT.get("/api/brand", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(getbrandsSuccess(res.data.data));
  } catch (err) {
    dispatch(getbrandsFailed());
  }
};
export const getAllBrandBySearchName = async (
  search,
  accessToken,
  dispatch
) => {
  dispatch(getbrandsStart());
  try {
    const res = await axios.get("/api/brand?Name=" + search, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(getbrandsSuccess(res.data.data));
  } catch (err) {
    dispatch(getbrandsFailed());
  }
};
export const getBrandDetails = async (id, accessToken, dispatch, axiosJWT) => {
  dispatch(getCurBrandStart());
  try {
    const res = await axiosJWT.get("/api/brand/" + id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(getCurBrandSuccess(res.data.data));
  } catch (err) {
    dispatch(getCurBrandFailed());
  }
};
export const getBrandDetailsForAdmin = async (
  id,
  accessToken,
  dispatch,
  axiosJWT
) => {
  dispatch(getCurBrandStart());
  try {
    const res = await axiosJWT.get(
      "/api/systemadmin/admin-get-brand-details/" + id,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(getCurBrandSuccess(res.data.data));
  } catch (err) {
    dispatch(getCurBrandFailed());
  }
};
export const getAllBrandTimeFrame = async (
  id,
  accessToken,
  dispatch,
  axiosJWT
) => {
  dispatch(getTimeFramesStart());
  try {
    const res = await axiosJWT.get(`/api/timeframe?BrandId=${id}&Active=true`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(getTimeFramesSuccess(res.data.data));
  } catch (err) {
    dispatch(getTimeFramesFailed());
  }
};
export const getTimeFrameDetails = async (id, accessToken, dispatch) => {
  dispatch(getCurTimeFrameStart());
  try {
    const res = await axios.get("/api/timeframe/" + id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(getCurTimeFrameSuccess(res.data.data));
  } catch (err) {
    dispatch(getCurTimeFrameFailed());
  }
};
export const getBrandConfig = async (accessToken, dispatch,axiosJWT) => {
  dispatch(getConfigStart());
  try {
    const res = await axiosJWT.get(
      "/api/brandconfiguration/get-brand-configuration",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(getConfigSuccess(res.data.data));
  } catch (err) {
    dispatch(getConfigFailed());
  }
};
