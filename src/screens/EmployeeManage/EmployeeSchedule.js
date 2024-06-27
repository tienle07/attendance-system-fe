import React, { useEffect, useReducer, useState } from "react";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import AttendanceModal from "./AttendanceModal";
import AssignShiftModal from "./AssignShiftModal";
function EmployeeSchedule(props) {
  const { employee, employeeid, storeId } = props;
  const [attendance, setAttendance] = useState([]);
  const [isAttendanceModal, setIsAttendanceModal] = useState(false);
  const [isAssignShiftModal, setIsAssignShiftModal] = useState(false);
  const [shiftHistoryEventData, setShiftHistoryEventData] = useState([]);
  const [shiftHistory, setShiftHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (employeeid) {
      getShiftHistory();
    }
  }, [employeeid,reducerValue]);

  const getShiftHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosJWT.get(
        `api/employeeshifthistory/get-employee-shift-histories?StoreId=${storeId}&EmployeeId=${employeeid}`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      getEventData(res.data.data);
    } catch (err) {
      console.log(err);
      // toast.error("" + err?.response?.data?.message);
    }
    setLoading(false);
  };
  const getEventData = (history) => {
    const eventsDatas = history
      ?.filter((data) => data.processingStatus !== -2)
      ?.map((d, i) => {
        return {
          id: d.id,
          title:
            d.shiftName +
            "  -  " +
            `${

                d?.processingStatus === -1
                ? "Absent"
                : d?.processingStatus === 1
                ? "Ready"
                : "Finished"
            }`,
          start: d.startTime,
          end: d.endTime,
          color: `${
              d?.processingStatus === -1
              ? "#e74c3c"
              : d?.processingStatus === 1
              ? "#ffc107"
              : "#198754"
          }`,
          extendedProps: d,
        };
      });
    setShiftHistoryEventData(eventsDatas);
  };
  const handleSelect = async(info) => {
    setShiftHistory(info.event.extendedProps);
    setIsAttendanceModal(true);
  };
  return (
    <div className="card card-chat-body border-0 order-1 w-100 px-4 px-md-5 py-3 py-md-4">
      {loading && <GrowingSpinner></GrowingSpinner>}
      {!loading && (
        <>
          <div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">
            <div className="d-flex">
              <a href="#!" title="">
                <img
                  className="avatar rounded"
                  src={employee?.profileImage}
                  alt="avatar"
                />
              </a>
              <div className="ms-3">
                <h6 className="mb-0">{employee?.employeeName}</h6>
                <small className="text-muted">{employee?.positionName}</small>
              </div>
            </div>
            <div className="d-flex">
              <a
                className="nav-link py-2 px-3 text-muted d-none d-lg-block"
                onClick={()=>setIsAssignShiftModal(true)}
              >
                <i className="fa fa-plus"></i>
              </a>
            </div>
          </div>
            <FullCalendar
              plugins={[listPlugin]}
              selectable={true}
              headerToolbar={{
                start: "title",
                center: "",
                end: "today prev,next",
              }}
              editable={false}
              initialView="listWeek"
              events={shiftHistoryEventData}
              // initialDate={shiftDate}
              noEventsContent="No Shift This Week "
              firstDay={1}
              height="auto"
              eventClick={(info) => {
                handleSelect(info);
              }}
            />
        </>
      )}
      <AttendanceModal
        show={isAttendanceModal}
        onClose={()=>{
          setIsAttendanceModal(false)
          setAttendance([])
        }}
        attendance={attendance}
        employee={employee}
        shiftHistory={shiftHistory}
        fore={foreUpdate}
      ></AttendanceModal>
      <AssignShiftModal
        show={isAssignShiftModal}
        setIsAssignShiftModal={setIsAssignShiftModal}
        isAssignShiftModal={isAssignShiftModal}
        employee={employee}
        foreUpdate={foreUpdate}
      ></AssignShiftModal>
    </div>
  );
}

export default EmployeeSchedule;
