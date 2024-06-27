import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ApplicationCard from "./ApplicationCard";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function EmployeeShift(props) {
  const { foreUpdate,id } = props;
  const storeid = localStorage.getItem('storeid');
  const employeeShifts = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.employeeShifts
  );
  const shiftPositions = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.shiftPositions
  );
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)

  const handlePostStatus = async(newStatus) =>{
    try {
      const res = await axiosJWT.put(
        "api/employeeinstore/store-manager-update-employee-in-store-status",
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  }
  const handleAccept =async(empid,shiftid,storeid,instoreid,empStatus,empshiftid)=>{
    try {
      const res = await axiosJWT.put("api/employeeshift/manager-approve-registration/"+empshiftid, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      if(empStatus !== 2) {
        const newStatus ={
          employeeInStoreId: instoreid,
          storeId: storeid,
          status: 2
        }
        handlePostStatus(newStatus);
      }
      toast.success("Accept Successfully");
      foreUpdate();
    } catch (err) {
      toast.error(""+err?.response?.data?.message);
    }
  }
  const handleReject =async(shiftid)=>{
    try {
      const res = await axiosJWT.put("/api/employeeshift/manager-reject-registration/"+shiftid, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      toast.success("Reject Successfully");
      foreUpdate();
    } catch (err) {
      toast.error(""+err?.response?.data?.message);
    }
  }


  return (
    <div className="row taskboard g-3 py-xxl-4">
      <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
        <h6 className="light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">Reject</h6>
        {employeeShifts
          ?.filter((e) => e.status === -1 || e.status === -2)
          .map((data, i) => {
            return <ApplicationCard 
                      key={"adsdc"+i}
                      data={data} 
                      background={'light-danger-bg'}
                    />;
          })}
      </div>
      <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
        <h6 className="light-warning-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">Pending</h6>
        {employeeShifts
          ?.filter((e) => e.status === 0)
          .map((data, i) => {
            return <ApplicationCard data={data}
                  key={"xczjkg"+i}
                  isHideAccept={true}
                  handleAccept={handleAccept}
                  handleReject={handleReject}
                  background={'light-warning-bg'}
                  />;
          })}
      </div>
      <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 mt-xxl-4 mt-xl-4 mt-lg-4 mt-md-4 mt-sm-4 mt-4">
        <h6 className="light-success-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">Accept</h6>
        {employeeShifts
          ?.filter((e) => e.status === 1 || e.status === 2)
          .map((data, i) => {
            return <ApplicationCard 
                      key={"dadcx"+i}
                      data={data}
                      background={'light-success-bg'} 
                    />;
          })}
      </div>

    </div>
  );
}

export default EmployeeShift;
