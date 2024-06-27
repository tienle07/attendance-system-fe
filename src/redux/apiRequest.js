import axios from "axios";
import { clearEmployee, getemployeesFailed, getemployeesStart, getemployeesSuccess } from "./employee/employeeSlice";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess } from "./auth/authSlice";
import { clearBranch, getbranchsFailed, getbranchsStart, getbranchsSuccess } from "./branch/branchSlice";
import { toast } from "react-toastify";
import { clearBrand } from "./brand/brandSlice";
import { GetCurrentUserLoginProfile } from "./auth/authApi";
const url = process.env.PUBLIC_URL;
const setLocal =(res) =>{
  localStorage.setItem('role', res?.data?.data?.account?.roleId);
  localStorage.setItem('brand', res?.data?.data?.account?.brandId);
  localStorage.setItem('brandName', res?.data?.data?.account?.brandName);
  localStorage.setItem('refresh', res?.data?.data?.token?.refreshToken);
}
export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try{
        const res = await axios.post("/api/authenticate", user);
        await GetCurrentUserLoginProfile(res?.data?.data?.account?.employeeId, dispatch, res?.data?.data?.token?.accessToken);
        if(res?.data?.data?.account?.roleId === 2){
          dispatch(loginSuccess(res.data));
          setLocal(res);
          navigate(url+"/hr-dashboard");
        }
        if(res?.data?.data?.account?.roleId === 3){
          dispatch(loginSuccess(res.data));
          setLocal(res);
          navigate(url+"/manager-dashboard");
        }
        if(res?.data?.data?.account?.roleId === 1){
          dispatch(loginSuccess(res.data));
          setLocal(res);
          navigate(url+"/brands");
        }
        if(res?.data?.data?.account?.roleId === 4){
          toast.error("Your Role Are Not Support On Web!");
          dispatch(loginFailed());
        }
    }catch(err){
        toast.error("" + err?.response?.data?.message);
        dispatch(loginFailed());
    }
}
export const logout = async ( dispatch, navigate) => {
  dispatch(logoutStart());
  try{
      dispatch(logoutSuccess());
      dispatch(clearEmployee());
      dispatch(clearBranch());
      dispatch(clearBrand());
      localStorage.removeItem('brand');
      localStorage.removeItem('storeid');
      localStorage.removeItem('role');
      navigate(url+"/sign-in");
  }catch(err){
      dispatch(logoutFailed());
  }
}
export const getAllEmployee = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getemployeesStart());
  try {
    const res = await axiosJWT.get("/api/employee/hr-get-employee-list", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getemployeesSuccess(res.data.data));
  } catch (err) {
    dispatch(getemployeesFailed());
    dispatch(clearEmployee());  
  }
};
export const getAllBranch = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getbranchsStart());
  try {
    const res = await axiosJWT.get("/api/store/hr-get-store-list", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getbranchsSuccess(res.data.data));
  } catch (err) {
    dispatch(getbranchsFailed());
  }
};
export const getCurrentWorkingBranch = async (accessToken, dispatch, axiosJWT) => {
  dispatch(getbranchsStart());
  try {
    const res = await axiosJWT.get("/api/store/hr-get-store-list", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getbranchsSuccess(res.data.data));
  } catch (err) {
    dispatch(getbranchsFailed());
  }
};
  