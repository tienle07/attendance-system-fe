import React from "react";
import moment from "moment";

function RegistrationCard(props) {
  const { data,handleReject,handleAccept } = props;
  return (
    <div className="dd-handle mt-2">
      <div className="task-info d-flex align-items-center justify-content-between">
        <h6
          className={`light-warning-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0`}
        >
          Work Registration
        </h6>
      </div>
      <div className="py-2 mb-0">
        <div className="row">
          <div className="col-xl-4">
            <span className="fw-bold">Shift: </span>
            {data?.shiftName}
          </div>
          <div className="col-xl-4">
            <span className="fw-bold">From: </span>
            {moment(data?.startTime).format("HH:mm, dddd MMM Do")}
          </div>
          <div className="col-xl-4">
            <span className="fw-bold">To: </span>
            {moment(data?.endTime).format("HH:mm, dddd MMM Do")}
          </div>

        </div>
      </div>
      <div className="tikit-info row g-3 align-items-center">
        <div className="col-sm">
          <ul className="d-flex list-unstyled align-items-center flex-wrap">
            <li className="me-2">
              <div className="d-flex align-items-center">
                <i className="icofont-flag"></i>
                <span className="ms-1">
                  {moment(data?.registerDate).format("MMMM Do YYYY")}
                </span>
              </div>
            </li>
          </ul>
        </div>
        {data?.status === 0 && (
          <div className="col-sm text-end">
            <div className="btn-group">
              <button
                className="btn small  btn-danger  d-inline-block fw-bold small"
                onClick={() => {
                    handleReject(data?.id)
                }}
              >
                <i className="icofont-error"></i>
              </button>
              <button
                className="btn small  btn-success d-inline-block fw-bold small"
                onClick={() => {
                  handleAccept(data?.id)
                }}
              >
                <i className="icofont-verification-check"></i>
              </button>
            </div>
          </div>
        )}
        {data?.status === -2 && (
          <div className="col-sm text-end">
            <span className="light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">
              Canceled
            </span>
          </div>
        )}
        {data?.status === -1 && (
          <div className="col-sm text-end">
            <span className="light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">
              Rejected
            </span>
          </div>
        )}
        {(data?.status === 1 || data?.status === 2) && (
          <div className="col-sm text-end">
            <span className="light-success-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">
              Approved
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistrationCard;
