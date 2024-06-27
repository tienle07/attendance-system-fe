import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function CheckAttendanceModal(props) {
  const { id, show, onHide, foreUpdate, shiftHistory, fore } = props;

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    setCheckIn(moment(shiftHistory?.startTime).format("HH:mm"));
    setCheckOut(moment(shiftHistory?.endTime).format("HH:mm"));
  }, [id]);
  const handleCheckAttendances = async (e) => {
    e.preventDefault();
    const attend = {
      employeeShiftHistoryId: id,
      checkIn:
        moment(shiftHistory?.startTime).format("YYYY-MM-DD") + "T" + checkIn,
      checkOut:
        moment(shiftHistory?.startTime).format("YYYY-MM-DD") + "T" + checkOut,
    };
    try {
      const res = await axiosJWT.post(
        "api/attendance/take-attendance",
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
          <Modal.Title className="fw-bold">Check Attendance</Modal.Title>
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
                Send
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CheckAttendanceModal;
