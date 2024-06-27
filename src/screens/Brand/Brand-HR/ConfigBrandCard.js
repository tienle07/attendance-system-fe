import moment from "moment";
import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBrandConfig } from "../../../redux/brand/brandApi";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../../redux/auth/authSlice";
import { createAxios } from "../../../createInstance";
import EditConfigModal from "../EditConfigModal";

function ConfigBrandCard(props) {
  const [isEditModal, setIsEditModal] = useState(false);
  const config = useSelector((state) => state.brand?.brandconfig?.config);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      getBrandConfig(user?.data?.token?.accessToken, dispatch, axiosJWT);
    }
  }, [reducerValue]);
  const convertticksToHours = (ticks) => {
    const hours = ticks / (60 * 60 * 1000 * 10000);
    return hours;
  };

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between">
        <h6 className="mb-0 fw-bold text-danger ">Config Brand</h6>
        <button
          type="button"
          hidden={localStorage.getItem("role") !== "2"}
          className="btn p-0"
          onClick={()=>setIsEditModal(true)}
        >
          <i className="icofont-edit text-primary fs-6"></i>
        </button>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mb-0">
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-8">
                <span className="fw-bold">Shift Duration</span>
              </div>
              <div className="col-4">
                <span className="text-muted">
                  {convertticksToHours(config?.maximumShiftDuration)} hours
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-8">
                <span className="fw-bold">Shift Modifiable Time</span>
              </div>
              <div className="col-4">
                <span className="text-muted">
                  {convertticksToHours(config?.shiftModifiableTime)} hours
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-8">
                <span className="fw-bold">Leave Requestable Time</span>
              </div>
              <div className="col-4">
                <span className="text-muted">
                  {convertticksToHours(config?.leaveRequestableTime)} hours
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-8">
                <span className="fw-bold">Attendance Modifiable Time</span>
              </div>
              <div className="col-4">
                <span className="text-muted">
                  {convertticksToHours(config?.attendanceModifiableTime)} hours
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-8">
                <span className="fw-bold"> Attendance Acceptable Range</span>
              </div>
              <div className="col-4">
                <span className="text-muted">
                  {config?.attendanceAcceptableRange} meter 
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <EditConfigModal
        show={isEditModal}
        onHide={()=>setIsEditModal(false)}
        foreUpdate={foreUpdate}
        config={config}
      ></EditConfigModal>
    </div>
  );
}

export default ConfigBrandCard;
