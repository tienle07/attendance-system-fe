import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import moment from "moment";

const convertBase64ToImageDataUrl = (base64String) => {
  return `data:image/png;base64,${base64String}`;
};

function AttendanceImageModal(props) {
  const { show, onHide, id, isImageModal } = props;
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const [details, setDetails] = useState({});
  const [loginimg, setLoginimg] = useState({});
  const [logoutimg, setLogoutimg] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      if (id) {
        fetchAttendanceDetails();
      }
    }
  }, [id, isImageModal]);
  const fetchAttendanceDetails = async () => {
    setLoading(true);
    if (isImageModal) {
      try {
        const response = await axiosJWT.get(
          `/api/attendance/get-attendance-details/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        setDetails(response.data.data);
        let checkInImageUrl = "";
        let checkOutImageUrl = "";
        if (response.data.data?.attendanceImages[0]?.imageBase64) {
          checkInImageUrl = convertBase64ToImageDataUrl(
            atob(response.data.data.attendanceImages[0]?.imageBase64)
          );
        }
        if (response.data.data?.attendanceImages[1]?.imageBase64) {
          checkOutImageUrl = convertBase64ToImageDataUrl(
            atob(response.data.data.attendanceImages[1]?.imageBase64)
          );
        }
        setLoginimg(checkInImageUrl);
        setLogoutimg(checkOutImageUrl);
      } catch (err) {
        console.log(err);
      }
    }
    setLoading(false);
  };
  return (
    <div>
      <Modal show={show} size="lg" onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Attendance Details</Modal.Title>
        </Modal.Header>
        {loading && <GrowingSpinner></GrowingSpinner>}
        {!loading && (
          <Modal.Body>
            <div className="modal-body">
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Employee" className="form-label">
                    Employee
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    id="Employee"
                    value={details?.attendance?.employeeName}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Mode" className="form-label">
                    Mode
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    id="Mode"
                    value={
                      details?.attendance?.mode === 1
                        ? "Checked In"
                        : details?.attendance?.mode === 2
                        ? "Checked Out"
                        : "Not Check"
                    }
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkin" className="form-label">
                    Check In
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    id="Checkin"
                    value={moment(details?.attendance?.checkIn).format(
                      "h:mm A, MMMM Do YYYY"
                    )}
                  />
                </div>
                <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput777"
                    className="form-label"
                  >
                    Check Out
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    id="exampleFormControlInput777"
                    value={ details?.attendance?.checkOut ? moment(details?.attendance?.checkOut).format(
                      "h:mm A, MMMM Do YYYY"
                    ) : "Not Check Out Yet"}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkinby" className="form-label">
                    Check In By
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    id="Checkinby"
                    value={
                      details?.attendance?.checkInMachineCode
                        ? `Machine: ${details?.attendance?.checkInMachineCode}`
                        : details?.attendance?.byManager
                        ? `Manager`
                        : `Not Checked In Yet`
                    }
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Checkoutby" className="form-label">
                    Check Out By
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    id="Checkoutby"
                    value={
                      details?.attendance?.checkOutMachineCode
                        ? `Machine: ${details?.attendance?.checkOutMachineCode}`
                        : details?.attendance?.byManager
                        ? `Manager`
                        : `Not Checked Out Yet`
                    }
                  />
                </div>
              </div>
              {!details?.attendance?.byManager ||
              details?.attendance?.checkInMachineCode ? (
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: "50%",
                      boxSizing: "border-box",
                      paddingRight: "10px",
                    }}
                  >
                    <p>Check In Image</p>
                    <img
                      style={{ width: "100%" }}
                      src={loginimg}
                      alt={`No Check In Image`}
                    />
                  </div>
                  <div
                    style={{
                      width: "50%",
                      boxSizing: "border-box",
                      paddingLeft: "10px",
                    }}
                  >
                    {logoutimg ? <p>Check Out Image</p> : <p>No Image</p>}
                    {logoutimg ? (
                      <img
                        style={{ width: "100%" }}
                        src={logoutimg}
                        alt={`No Check Out Image`}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AttendanceImageModal;
