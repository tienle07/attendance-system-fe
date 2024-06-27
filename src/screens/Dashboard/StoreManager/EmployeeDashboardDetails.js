import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/auth/authSlice";
import GrowingSpinner from "../../../components/UI/GrowingSpinner";

function EmployeeDashboardDetails(props) {
  const { show, onHide, id,name } = props;
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const storeid = localStorage.getItem('storeid');
  const [details, setDetails] = useState({});
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
        fetchEmployeeDetails();
      }
    }
  }, [id]);
  const fetchEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        `/api/dashboard/sm-get-employee-statistic?employeeId=${id}&storeId=${storeid}`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setDetails(response.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <div>
      <Modal show={show} size="lg" onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Employee Statistic</Modal.Title>
        </Modal.Header>
        {loading && <GrowingSpinner></GrowingSpinner>}
        {!loading && (
          <Modal.Body>
            <div className="modal-body">
              <div className="row g-3 mb-3">
                <label htmlFor="Employee" className="form-label">
                  Employee
                </label>
                <input
                  type="text"
                  readOnly
                  className="form-control"
                  id="Employee"
                  value={name}
                />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Employee" className="form-label">
                    Today Shift Finished
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    id="Employee"
                    value={`${details?.totalTodayWorkProgressFinished}`}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Mode" className="form-label">
                    This Month Shift Finished
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthWorkProgressFinished}`}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkin" className="form-label">
                    Today Work Duration Finished
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalTodayWorkDurationFinished} hours`}
                  />
                </div>
                <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput777"
                    className="form-label"
                  >
                    This Month Work Duration Finished
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthWorkDurationFinished} hours`}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkinby" className="form-label">
                    Today Leave Request Approved
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalTodayLeaveApplicationApproved}`}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Checkoutby" className="form-label">
                    This Month Leave Request Approved
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthLeaveApplicationApproved}`}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkinby" className="form-label">
                    Today Attendance
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalTodayAttendance}`}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Checkoutby" className="form-label">
                    This Month Attendance
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthAttendance}`}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkinby" className="form-label">
                    Today Attendance Qualified
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalTodayAttendanceQualified}`}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Checkoutby" className="form-label">
                    This Month Attendance Qualified
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthAttendanceQualified}`}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkinby" className="form-label">
                    Today Attendance Unqualified
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalTodayAttendanceUnqualified}`}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Checkoutby" className="form-label">
                    This Month Attendance Unqualified
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthAttendanceUnqualified}`}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkinby" className="form-label">
                    Today Attendance Not On Time
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalTodayAttendanceNotOnTime}`}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Checkoutby" className="form-label">
                    This Month Attendance Not On Time
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthAttendanceNotOnTime}`}
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label htmlFor="Checkinby" className="form-label">
                    Today Attendance Absent
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalTodayAttendanceAbsent}`}
                  />
                </div>
                <div className="col-lg-6">
                  <label htmlFor="Checkoutby" className="form-label">
                    This Month Attendance Absent
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="form-control"
                    value={`${details?.totalMonthAttendanceAbsent}`}
                  />
                </div>
              </div>
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

export default EmployeeDashboardDetails;
