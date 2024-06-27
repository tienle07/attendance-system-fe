import axios from "axios";
import {getCurBranchsFailed, getCurBranchsStart, getCurBranchsSuccess, getEmployeeInCurBranchFailed, getEmployeeInCurBranchStart, getEmployeeInCurBranchSuccess } from "./branchSlice";
import { toast } from "react-toastify";
const url = process.env.PUBLIC_URL;
// export const createBranch = async (branch, dispatch,accessToken) => {
//     dispatch(createbranchsStart());
//     try {
//       const res = await axios.post("/api/store/hr-add-new-store",branch, {
//         headers: { 
//           Authorization: `Bearer ${accessToken}`,
//       },
//       })
//       toast.success("Create Branch Successfully");
//       dispatch(createbranchsSuccess());
//     } catch (err) {
//       toast.error("Create Branch Failed")
//       dispatch(createbranchsFailed());
//     }
// };
// export const editBranch = async (id,branch, dispatch,accessToken) => {
//   dispatch(editbranchStart());
//   try {
//     const res = await axios.put("/api/store/hr-update-store-infor/"+id,branch, {
//       headers: { 
//         Authorization: `Bearer ${accessToken}`,
//     },
//     })
//     console.log(res.data);
//     toast.success("Updated Branch Successfully");
//     dispatch(editbranchSuccess(res.data));
//   } catch (err) {
//     toast.error("Edit Branch Failed")
//     dispatch(editbranchFailed());
//   }
// };
// export const editBranchStatus = async (id,status, dispatch,accessToken) => {
//   dispatch(editbranchStart());
//   try {
//     const res = await axios.put("/api/store/hr-update-store-status/"+id,status, {
//       headers: { 
//         Authorization: `Bearer ${accessToken}`,
//     },
//     })
//     console.log(res.data);
//     toast.success("Updated Branch Status Successfully");
//     dispatch(editbranchSuccess(res.data));
//   } catch (err) {
//     toast.error("Updated Branch Status Fail")
//     dispatch(editbranchFailed());
//   }
// };
export const getCurBranchSelect = async (id, dispatch,accessToken,axiosJWT) => {
  dispatch(getCurBranchsStart());
  try {
    const res = await axiosJWT.get("/api/employeeinstore/manager-get-store-details?StoreId="+id, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })  
    dispatch(getCurBranchsSuccess(res.data.data));
  } catch (err) {
    dispatch(getCurBranchsFailed());
  }
}; 
export const getEmployeeInCurBranch = async (id, dispatch,accessToken) => {
  dispatch(getEmployeeInCurBranchStart());
  try {
    const res = await axios.get("/api/employeeinstore/getemployeeinstore?Id="+id, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getEmployeeInCurBranchSuccess(res.data.data));
  } catch (err) {
    dispatch(getEmployeeInCurBranchFailed());
  }
};  
