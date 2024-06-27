import axios from "axios";
import { clearEmployee, editemployeeFailed, editemployeeStart, editemployeesSuccess, getCurEmployeesFailed, getCurEmployeesStart, getCurEmployeesSuccess, getListAddToStoreFailed, getListAddToStoreStart, getListAddToStoreSuccess, getPositionFailed, getPositionStart, getPositionSuccess, getPromoteEmployeeListFailed, getPromoteEmployeeListStart, getPromoteEmployeeListSuccess, getTypeFailed, getTypeStart, getTypeSuccess, getemployeesFailed, getemployeesStart, getemployeesSuccess } from "./employeeSlice";

export const getCurEmployeeSelect = async (id, dispatch,accessToken,axiosJWT) => {
    dispatch(getCurEmployeesStart());
    try {
      const res = await axiosJWT.get("/api/employee/get-employee-detail/"+id, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
      })
      dispatch(getCurEmployeesSuccess(res.data.data));
    } catch (err) {
      dispatch(getCurEmployeesFailed());
      dispatch(clearEmployee());  

    }
}; 
export const getEmployeeType = async (dispatch,accessToken,axiosJWT) => {
  dispatch(getTypeStart());
  try {
    const res = await axiosJWT.get("/api/employeetype", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getTypeSuccess(res.data.data));
  } catch (err) {
    dispatch(getTypeFailed());
  }
}; 
export const getEmployeePosition = async (dispatch,accessToken,axiosJWT) => {
  dispatch(getPositionStart());
  try {
    const res = await axiosJWT.get("/api/position", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getPositionSuccess(res.data.data));
  } catch (err) {
    dispatch(getPositionFailed());
  }
}; 
export const createEmployee = async (employee,accessToken) => {
  try {
    const res = await axios.post("/api/employee",employee, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    return res;
  } catch (err) {
    return err
  }
};
export const editEmployee = async (id,employee,dispatch,accessToken) => {
  dispatch(editemployeeStart());
  try {
    const res = await axios.post("/api/employee/hr-update-employee-infor/"+id,employee, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(editemployeesSuccess());
  } catch (err) {
    dispatch(editemployeeFailed(err));
  }
};
export const getListEmployeeForPromte = async (accessToken, dispatch,axiosJWT) => {
  dispatch(getPromoteEmployeeListStart());
  try {
    const res = await axiosJWT.get("/api/employee/hr-get-promotable-list", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getPromoteEmployeeListSuccess(res.data.data));
  } catch (err) {
    dispatch(getPromoteEmployeeListFailed());
  }
};
export const getListEmployeeForAdd = async (id,dispatch,accessToken,axiosJWT) => {
  dispatch(getListAddToStoreStart());
  try {
    const res = await axiosJWT.get("/api/employee/hr-get-assignable-list/"+id, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
    },
    })
    dispatch(getListAddToStoreSuccess(res.data.data));
  } catch (err) {
    dispatch(getListAddToStoreFailed());
  }
};
export const getAllEmployeeInStore = async (id,accessToken, dispatch,axiosJWT) => {
  dispatch(getemployeesStart());
  try {
    const res = await axiosJWT.get("/api/employeeinstore/manager-get-employees-in-store/"+id, {
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
export const getAllEmployeeBySearchName = async (name,page,status,accessToken, dispatch) => {
  dispatch(getemployeesStart());
  try {
    if(name){
      const res = await axios.get(`/api/employee/hr-get-employee-list?Name=${name}&Page=${page ? page : 1}&Size=10&delay=1&${status === 'active'? `&Active=${true}` : status === 'inactive' ? `&Active=${false}` : ''}`, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
    }).then(dispatch(getemployeesSuccess(res.data)))
    // dispatch(getemployeesSuccess(res.data));
    }
    else{
      const res = await axios.get(`/api/employee/hr-get-employee-list?Page=${page ? page : 1}&Size=10&delay=1${status === 'active'? `&Active=${true}` : status === 'inactive' ? `&Active=${false}` : ''}`, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
      },
    })
    dispatch(getemployeesSuccess(res.data));
    }
  } catch (err) {
    dispatch(getemployeesFailed());
    dispatch(clearEmployee());  
  }
};