import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function EditAttendanceCard(props) {
  const {
    id,
    isEditModal,
    show,
    onHide,
    foreUpdate,
    shiftHistory,
    fore,
    loginTime,
    logoutTime,
    attendanceId,
  } = props;

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    setCheckIn(
      loginTime
        ? moment(loginTime).format("HH:mm")
        : moment(shiftHistory?.startTime).format("HH:mm")
    );
    setCheckOut(
      logoutTime
        ? moment(logoutTime).format("HH:mm")
        : moment(shiftHistory?.endTime).format("HH:mm")
    );
  }, [id,attendanceId,isEditModal]);
  const handleCheckAttendances = async (e) => {
    e.preventDefault();
    const attend = {
      employeeShiftHistoryId: id,
      checkIn:
        (loginTime
          ? moment(loginTime).format("YYYY-MM-DD")
          : moment(shiftHistory?.startTime).format("YYYY-MM-DD")) +
        "T" +
        checkIn,
      checkOut:
        (logoutTime
          ? moment(logoutTime).format("YYYY-MM-DD")
          : moment(shiftHistory?.endTime).format("YYYY-MM-DD")) +
        "T" +
        checkOut,
    };
    try {
      const res = await axiosJWT.put(
        "api/attendance/update-attendance/" + attendanceId,
        attend,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        foreUpdate();
        fore();
        toast.success("Check Attendance Success");
        onHide();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Attendance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form data-parsley-validate="" onSubmit={handleCheckAttendances}>
            <div className="row g-3 mb-3">
              <div className="col-sm-6">
                <label htmlFor="depone" className="form-label">
                  Check In At
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                />
              </div>
              <div className="col-sm-6">
                <label htmlFor="depone" className="form-label">
                  Check Out At
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="d-flex flex-row-reverse">
              <button type="submit" className="btn btn-primary">
                Change
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditAttendanceCard;
