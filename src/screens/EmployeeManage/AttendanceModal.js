import React, { useEffect, useReducer, useState } from "react";
import { Modal } from "react-bootstrap";
import ShiftInfoCard from "./ShiftInfoCard";
import AttendanceCard from "./AttendanceCard";
import { toast } from "react-toastify";
import CheckAttendanceModal from "./CheckAttendanceModal";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import EditAttendanceCard from "./EditAttendanceCard";
import AttendanceImageModal from "../Attendance/AttendanceModal";

function AttendanceModal(props) {
  const { onClose, show, employee, shiftHistory, fore } = props;
  const user = useSelector((state) => state.auth?.login?.currentUser);

  const [isCheckModal, setIsCheckModal] = useState(false);
  const [isImageModal, setIsImageModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [check, setCheck] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [shiftHistoryDetails, setShiftHistoryDetails] = useState({});
  const [checkInImage, setCheckInImage] = useState("");
  const [checkOutImage, setCheckOutImage] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [attendanceId, setAttendanceId] = useState("");
  const [loading, setLoading] = useState([]);
  const dispatch = useDispatch();
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    getAsyns();
  }, [reducerValue, shiftHistory?.id]);
  const getAsyns = async () => {
    await fetchShiftHistoryDetails();
    await fetchAttendance();
    // isPossibleToCheckAttendance();
  };
  const fetchAttendance = async () => {
    setLoading(true);
    if (shiftHistory?.id) {
      try {
        const res = await axiosJWT.get(
          "api/attendance/get-history-attendances/" + shiftHistory.id,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        console.log(res);
        if (res.status === 204) {
          setAttendance(null);
        }
        if (res.data.code >= 200 && res.data.code < 300) {
          setAttendance(res.data.data);
        }
      } catch (err) {
        console.log(err?.response?.data);
        toast.error("Server Error! Try Again Later");
      }
    }
    setLoading(false);
  };
  const fetchShiftHistoryDetails = async () => {
    setLoading(true);
    if (shiftHistory?.id) {
      try {
        const res = await axiosJWT.get(
          "api/employeeshifthistory/get-employee-shift-history/" +
            shiftHistory.id,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        if (res.status === 204) {
          setShiftHistoryDetails(null);
        }
        if (res.data.code >= 200 && res.data.code < 300) {
          setShiftHistoryDetails(res.data.data);
          const diff = moment(res.data.data.endTime).diff(moment());
          if (-86400000 < diff && diff < 0) {
            setCheck(true);
          } else setCheck(false);
        }
      } catch (err) {
        console.log(err?.response?.data);
        toast.error("Server Error! Try Again Later");
      }
    }
    setLoading(false);
  };
  const isPossibleToCheckAttendance = () => {
    const diff = moment(shiftHistoryDetails?.endTime).diff(moment());
    if (-86400000 < diff && diff < 0) {
      setCheck(true);
    } else setCheck(false);
  };
  const handleEdit = (login, logout, id) => {
    setLoginTime(login);
    setLogoutTime(logout);
    setAttendanceId(id);
    setIsEditModal(true);
  };
  const handleDelete = async () => {
    try {
      const res = await axiosJWT.put(
        "api/employeeshifthistory/manager-cancel-employee-work/" +
          shiftHistory.id,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Remove Employee Shift Success");
        fore();
        onClose();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  return (
    <>
      <Modal
        centered
        dialogClassName="attendance-modal"
        show={show}
        onHide={onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Work Details</Modal.Title>
        </Modal.Header>
        <Modal.Body id="example-custom-modal-styling-title">
          <div className="modal-body">
            <div className="row clearfix g-3">
              <div className="col-lg-12 col-md-12 flex-column">
                <div className="row g-3 row-deck">
                  <div className="col-xl-7">
                    <ShiftInfoCard shiftInfo={shiftHistoryDetails} />
                  </div>
                  <div className="col-xl-5">
                    <div className="card">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-bold ">Attendance</h6>
                        {check && !attendance ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => setIsCheckModal(true)}
                          >
                            Check Attendance
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                      {!attendance && (
                        <div className="task-info d-flex align-items-center justify-content-between">
                          <h6
                            className={`light-danger-bg py-1 px-4 rounded-1 d-inline-block fw-bold small-14 mb-0`}
                          >
                            Not Check Attendance Yet !!!
                          </h6>
                        </div>
                      )}
                      {loading && <GrowingSpinner></GrowingSpinner>}
                      {!loading && (
                        <>
                          <div className="card-body">
                            <div className="flex-grow-1 attendance-list">
                              {attendance?.map((data, i) => {
                                return (
                                  <div
                                    key={"asdad" + i}
                                    className=" d-flex align-items-center border-bottom"
                                  >
                                    <AttendanceCard
                                      attendance={data}
                                      employee={employee}
                                      setIsImageModal={setIsImageModal}
                                      setCheckInImage={setCheckInImage}
                                      setCheckOutImage={setCheckOutImage}
                                      setLoginTime={setLoginTime}
                                      setLogoutTime={setLogoutTime}
                                      handleEdit={handleEdit}
                                      setAttendanceId={setAttendanceId}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Remove
          </button>
        </Modal.Footer>
      </Modal>
      <CheckAttendanceModal
        id={shiftHistoryDetails?.id}
        shiftHistory={shiftHistoryDetails}
        show={isCheckModal}
        onHide={() => setIsCheckModal(false)}
        foreUpdate={foreUpdate}
        fore={fore}
      ></CheckAttendanceModal>
      <EditAttendanceCard
        id={shiftHistoryDetails?.id}
        shiftHistory={shiftHistoryDetails}
        show={isEditModal}
        onHide={() => setIsEditModal(false)}
        foreUpdate={foreUpdate}
        fore={fore}
        loginTime={loginTime}
        logoutTime={logoutTime}
        attendanceId={attendanceId}
        isEditModal={isEditModal}
      ></EditAttendanceCard>
      <AttendanceImageModal
        show={isImageModal}
        onHide={() => {
          setIsImageModal(false);
        }}
        id={attendanceId}
        isImageModal={isImageModal}
      ></AttendanceImageModal>
    </>
  );
}

export default AttendanceModal;
