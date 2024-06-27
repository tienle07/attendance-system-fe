import axios from "axios";
import { generateAccountForEmployeeFailed, generateAccountForEmployeeStart, generateAccountForEmployeeSuccess, getCurUserLoginProfileFailed, getCurUserLoginProfileStart, getCurUserLoginProfileSuccess } from "./authSlice";
import { toast } from "react-toastify";
const url = process.env.PUBLIC_URL;
export const GetCurrentUserLoginProfile = async (id, dispatch, accessToken) => {
  dispatch(getCurUserLoginProfileStart());
  try {
    const res = await axios.get("/api/employee/get-employee-detail/" + id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      if(res?.data?.data?.accountResponseModel?.roleId === 3){
        try{
          const storeid = await axios.get("/api/employeeinstore/manager-get-main-storeid", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          localStorage.setItem("storeid", storeid.data.data);
        }catch (err){
          localStorage.setItem("storeid", '');
        }
      }
    dispatch(getCurUserLoginProfileSuccess(res.data.data));

  } catch (err) {
    dispatch(getCurUserLoginProfileFailed());
  }
};

export const GenerateAccountForEmployee = async (id1, id, dispatch, accessToken) => {
  dispatch(generateAccountForEmployeeStart());
  try {
    const res = await axios.post("/api/account/create-account-for-employee/" + id1, id, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    toast.success("Generated account for employee successfully")
    dispatch(generateAccountForEmployeeSuccess(res.data));
  } catch (err) {
    toast.error("" + err?.response?.data?.message);
    dispatch(generateAccountForEmployeeFailed());
  }
};
