import React from "react";
import { useSelector } from "react-redux";


function EmployeeAvailable() {
  const employeeList = useSelector(
    (state) =>
      state.branchs?.currentBranchSelect?.curBranch
        ?.employeeInStoreResponseModels
  )?.filter((e)=> e.positionId !== 1 && (e.status !== -1));

  return (
    <div className="card">
      <div className="card-header py-3">
        <h6 className="mb-0 fw-bold ">Employee Available</h6>
      </div>
      <div className="card-body">
        <div className="flex-grow-1 mem-list">
          {employeeList?.map((employee, i) => {
            return(
            <div key ={"asdad"+i} className="py-2 d-flex align-items-center border-bottom">
              <div className="d-flex ms-2 align-items-center flex-fill">
                <img
                  src={employee?.profileImage}
                  className="avatar lg rounded-circle img-thumbnail"
                  alt="avatar"
                />
                <div className="d-flex flex-column ps-2">
                  <h6 className="fw-bold mb-0">{employee?.employeeName}</h6>
                  <span className="small text-muted">{employee?.typeName}</span>
                </div>
              </div>
              <h6 className="fw-bold mb-0">{employee?.positionName}</h6>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default EmployeeAvailable;
