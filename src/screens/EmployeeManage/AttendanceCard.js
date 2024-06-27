import React from "react";
import moment from "moment";
function AttendanceCard(props) {
  const { attendance, employee,setIsImageModal,handleEdit,setAttendanceId } = props;
  const handleClickViewImage = (id) => {
    setAttendanceId(id)
    setIsImageModal(true)
  }
  return (
    <>
    <div className="card-body ">
      <div className="dd-handle mt-2">
        <div className="task-info d-flex align-items-center justify-content-between">
          <h6
            className={`light-warning-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0`}
          >
            {employee?.employeeName}
          </h6>
          <div className="task-priority d-flex flex-column align-items-center justify-content-center">
            <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary fs-6"
              onClick={()=>handleEdit(attendance?.checkIn,attendance?.checkOut,attendance?.id)}
            >
              <i className="icofont-edit text-warning"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary fs-6"
              onClick={()=>handleClickViewImage(attendance?.id)}
            >
              <i className="icofont-eye text-success"></i>
            </button>
            </div>
          </div>
        </div>
        <div className="py-2 mb-0">
          <div className="row">
            <div className="col-xl-6">
              <span className="fw-bold  ">Check In: </span>
              {attendance?.checkIn ? moment(attendance?.checkIn).format("hh:mm a") : 'Not Check'}
            </div>
            <div className="col-xl-6">
              <span className="fw-bold">Check Out: </span>
              {attendance?.checkOut ? moment(attendance?.checkOut).format("hh:mm a") : 'Not Check'}
            </div>
          </div>
        </div>
        <div className="tikit-info row g-3 align-items-center">
          <div className="col-7">
            <ul className="d-flex list-unstyled align-items-center flex-wrap">
              <li className="me-2">
                <div className="d-flex align-items-center">
                  <i className="icofont-flag"></i>
                  <span className="ms-1">
                    Check by {attendance?.byManager ? "Manager" : "Machine"}
                  </span>
                </div>
              </li>
            </ul>
          </div>
          {attendance?.mode === 2 && (
            <div className="col-5 text-end">
              <span className="light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">
                Checked Out
              </span>
            </div>
          )}
          {attendance?.mode === 1 && (
            <div className="col-5 text-end">
              <span className="light-success-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">
                Checked In
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </>);
}

export default AttendanceCard;