import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";

function ShiftInfor(props) {
  const { onClickEditShiftInfo } = props;

  const shiftInfo = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.workShift
  );
  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between">
        <h6 className="mb-0 fw-bold ">Shift Infomation</h6>
        <button
          type="button"
          hidden={localStorage.getItem('role')!=='3'}
          className="btn p-0"
          onClick={onClickEditShiftInfo}
        >
          <i className="icofont-edit text-primary fs-6"></i>
        </button>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mb-0">
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-6">
                <span className="fw-bold">Name</span>
              </div>
              <div className="col-6">
                <span className="text-muted">{shiftInfo?.shiftName}</span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-6">
                <span className="fw-bold">Time Frame</span>
              </div>
              <div className="col-6">
                <span className="text-muted">{shiftInfo?.timeFrameName}</span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-6">
                <span className="fw-bold">Start Date</span>
              </div>
              <div className="col-6">
                <span className="text-muted">
                  {moment(shiftInfo?.startTime).format("MMMM Do YYYY")}
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-6">
                <span className="fw-bold">Holiday</span>
              </div>
              <div className="col-6">
                <span className="text-muted">
                <span className="text-muted">{shiftInfo?.holidayName ? shiftInfo?.holidayName : "Not Holiday"}</span>
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-6">
                <span className="fw-bold">Start At</span>
              </div>
              <div className="col-6">
                <span className="text-muted">
                  {moment(shiftInfo?.startTime).format("HH:mm")}
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-6">
                <span className="fw-bold">End At</span>
              </div>
              <div className="col-6">
                <span className="text-muted">
                  {moment(shiftInfo?.endTime).format("HH:mm")}
                </span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-6">
                <span className="fw-bold">Status</span>
              </div>
              <div className="col-6">
                {shiftInfo?.status === 1 ? (
                  <span className="badge bg-success">Ongoing</span>
                ) : shiftInfo?.status === 0 ? (
                  <span className="badge bg-warning">Pending</span>
                ) : shiftInfo?.status === 2 ? (
                  <span className="badge bg-success">Finished</span>
                ) : (       
                  <span className="badge bg-danger">Not Working</span>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ShiftInfor;
