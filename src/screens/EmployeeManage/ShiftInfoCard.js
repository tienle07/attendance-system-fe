import moment from "moment";
import React from "react";

function ShiftInfoCard(props) {
  const { shiftInfo } = props;

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between">
        <h6 className="mb-0 fw-bold text-danger">Shift Tracking</h6>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mb-0">
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-3">
                <span className="fw-bold">Name</span>
              </div>
              <div className="col-9">
                <span className="text-muted">{shiftInfo?.shiftName}</span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-3">
                <span className="fw-bold">Date</span>
              </div>
              <div className="col-9">
                <span className="text-muted">
                  {moment(shiftInfo?.startTime).format("MMMM Do YYYY")}
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-3">
                <span className="fw-bold">From</span>
              </div>
              <div className="col-3">
                <span className="text-muted">
                  {moment(shiftInfo?.startTime).format("HH:mm a")}
                </span>
              </div>
              <div className="border-start col-3">
                <span className="fw-bold">To</span>
              </div>
              <div className="col-3">
                <span className="text-muted">
                  {moment(shiftInfo?.endTime).format("HH:mm a")}
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-3">
                <span className="fw-bold">First Check In</span>
              </div>
              <div className="col-3">
                <span className="text-muted">
                  {shiftInfo?.checkOut ? moment(shiftInfo?.checkIn).format("HH:mm a") : "Not Yet"}
                </span>
              </div>
              <div className="border-start col-3">
                <span className="fw-bold">Last Check Out</span>
              </div>
              <div className="col-3">
                <span className="text-muted">
                  {shiftInfo?.checkOut ? moment(shiftInfo?.checkOut).format("HH:mm a") : "Not Yet"}
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
            <div className="col-3">
                <span className="fw-bold">Check In Status</span>
              </div>
              <div className="col-3">
                {shiftInfo?.inMode === -1 ? (
                  <span className=" text-danger fw-bold">Absent</span>
                ) : shiftInfo?.inMode === 1 ? (
                  <span className=" text-success fw-bold">On Time</span>
                ) : shiftInfo?.inMode === 0 ? (
                  <span className=" text-warning fw-bold">Come Late</span>
                ) : (
                  <span className=" fw-bold">Not Yet</span>
                )}
              </div>
              <div className="col-3">
                <span className="fw-bold">Check Out Status</span>
              </div>
              <div className="col-3">
              {shiftInfo?.outMode === -1 ? (
                  <span className=" text-danger fw-bold">Absent</span>
                ) : shiftInfo?.outMode === 1 ? (
                  <span className=" text-success fw-bold">On Time</span>
                ) : shiftInfo?.outMode === 0 ? (
                  <span className=" text-warning fw-bold">Leave Early</span>
                ) : (
                  <span className=" fw-bold">Not Yet</span>
                )}
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-3">
                <span className="fw-bold">Check In Expand</span>
              </div>
              <div className="col-3">
                <span className="text-muted">{shiftInfo?.checkInExpand}</span>
              </div>
              <div className="border-start col-3">
                <span className="fw-bold">Check Out Expand</span>
              </div>
              <div className="col-3">
                <span className="text-muted">{shiftInfo?.checkOutExpand}</span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-3">
                <span className="fw-bold">Come Late Expand</span>
              </div>
              <div className="col-3">
                <span className="text-muted">{shiftInfo?.comeLateExpand}</span>
              </div>
              <div className="border-start col-3">
                <span className="fw-bold">Leave Early Expand</span>
              </div>
              <div className="col-3">
                <span className="text-muted">
                  {shiftInfo?.leaveEarlyExpand}
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
            <div className="col-3">
                <span className="fw-bold">Evaluate</span>
              </div>
              <div className="col-3">
                {shiftInfo?.workOrderStatus === -1 ? (
                  <span className="badge bg-danger">Unqualified</span>
                ) : shiftInfo?.workOrderStatus === 1 ? (
                  <span className="badge bg-success">Qualified</span>
                ) : shiftInfo?.workOrderStatus === 0 ? (
                  <span className="badge bg-warning">Pending</span>
                ) : (
                  <span className="badge bg-danger">Not Yet</span>
                )}
              </div>
              <div className="col-3">
                <span className="fw-bold">Final Status</span>
              </div>
              <div className="col-3">
                {shiftInfo?.processingStatus === -1 ? (
                  <span className="badge bg-danger">Absent</span>
                ) : shiftInfo?.processingStatus === 1 ? (
                  <span className="badge bg-warning">Ready</span>
                ) : (
                  <span className="badge bg-success">Finished</span>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ShiftInfoCard;
