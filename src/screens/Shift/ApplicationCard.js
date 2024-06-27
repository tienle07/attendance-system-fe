import React from "react";
import moment from "moment";
import { useSelector } from "react-redux";


function ApplicationCard(props) {
  const {
    data,
    isHideAccept,
    handleAccept,
    handleReject,
    background,
  } = props;
  const employeeList = useSelector(
    (state) =>
      state.branchs?.currentBranchSelect?.curBranch
        ?.employeeInStoreResponseModels
  ).filter((e)=> e.positionName !== "Store Manager" && (e.status !== -1));
  const emp = employeeList.filter((e) => e.employeeId === data?.employeeId)
  return (
    <div className="dd-handle mt-2">
      <div className="task-info d-flex align-items-center justify-content-between">
        <h6
          className={`${background} py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0`}
        >
          {data?.employeeName}
        </h6>
        <div className="task-priority d-flex flex-column align-items-center justify-content-center">
                  <img
                    className="avatar lg rounded-circle img-thumbnail"
                    src={emp[0]?.profileImage}
                    alt=''
                  />
        </div>
      </div>
      <p className="py-2 mb-0">
        {data?.note ? data?.note : "No Note From Employee"}
      </p>
      <div className="tikit-info row g-3 align-items-center">
        <div className="col-sm">
          <ul className="d-flex list-unstyled align-items-center flex-wrap">
            <li className="me-2">
              <div className="d-flex align-items-center">
                <i className="icofont-flag"></i>
                <span className="ms-1">{moment(data?.registerDate).format("MMMM Do YYYY")}</span>
              </div>
            </li>
          </ul>
        </div>
        {isHideAccept && (
          <div className="col-sm text-end">
            <div className="btn-group">
              <button className="btn small  btn-danger  d-inline-block fw-bold small" hidden={localStorage.getItem('role')!=='3'} onClick={()=>handleReject(data?.id)}>
                <i className="icofont-error"></i>
              </button>
              <button className="btn small  btn-success d-inline-block fw-bold small" hidden={localStorage.getItem('role')!=='3'} onClick={()=>handleAccept(data?.employeeId,data?.workShiftId,data?.storeId,emp[0]?.id,emp[0]?.status,data?.id)}>
                <i className="icofont-verification-check"></i>
              </button>
            </div>
          </div>
        )}
        {data?.status === -2 && (
          <div className="col-sm text-end">
              <span className="light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">Canceled</span>
          </div>
        )}
        {data?.status === -1 && (
          <div className="col-sm text-end">
              <span className="light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-14 mb-0">Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApplicationCard;
