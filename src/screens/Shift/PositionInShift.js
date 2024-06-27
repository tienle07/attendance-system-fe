import React from "react";
import { useSelector } from "react-redux";

function PositionInShift(props) {
  const {
    setIsEditPositionInShiftModal,
    setIsAddNewPositionModal,
    setIsDeletePositionModal,
    setPosIdForDelete,
  } = props;
  const positions = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.shiftPositions
  );
  const employeeShift = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.employeeShifts
  );
  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  );

  const getPositionNameById = (id) => {
    const positionObj = positionList?.find((x) => x.id === id);

    return positionObj?.name;
  };
  function callopsEvent(id) {
    var divis = document.getElementById(id);
    if (divis) {
      if (divis.classList.contains("show")) {
        divis.classList.remove("show");
      } else {
        divis.classList.add("show");
      }
    }
  }
  return (
    <>
      <div className="card">
        <div className="card-header py-3 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-bold">Position</h6>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary fs-6"
              hidden={localStorage.getItem('role')!=='3'}
              onClick={() => setIsAddNewPositionModal(true)}
            >
              <i className="icofont-plus text-success"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary  fs-6"
              hidden={localStorage.getItem('role')!=='3'}
              onClick={() => setIsEditPositionInShiftModal(true)}
            >
              <i className="icofont-edit text-warning"></i>
            </button>
          </div>
        </div>
        <div className="card-body">
          <ul className="list-unstyled mb-0">
            {positions?.filter((pos)=>pos.quantity!== 0).map((pos, i) => {
              return (
                <li key={"dsfnj" + i} className="row flex-wrap mb-1 ps-4">
                  <div className="row">
                    <div
                      className="py-1 d-flex align-items-center btn btn-light text-start p-3 rounded-0"
                      onClick={() => {
                        callopsEvent("collapse" + i);
                      }}
                    >
                      <div className="col-5">
                        <div>
                          <i className="icofont-rounded-down pe-3"></i>
                          <span className="fw-bold">
                            {getPositionNameById(pos?.positionId)}
                          </span>
                        </div>
                      </div>
                      <div className="col-3">
                        <span className="text-muted">{pos?.quantity} Slot</span>
                      </div>
                      <div className="col-3">
                        <span className="text-muted">
                          {pos?.available} Available
                        </span>
                      </div>
                      <div className="col-1">
                        <button
                          type="button"
                          className="btn"
                          hidden={localStorage.getItem('role')!=='3'}
                          onClick={() => {setIsDeletePositionModal(true);setPosIdForDelete(pos?.id)}}
                        >
                          <i className="icofont-trash text-danger"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div id={`collapse${i}`} className="col-12  collapse">
                      <div className="card-body">
                        {!employeeShift?.find(
                          (e) =>
                            e.positionId === pos?.positionId && e.status === 1
                        ) && (
                          <div>
                            <span className=" mb-0">
                              No Employee In This Position
                            </span>
                          </div>
                        )}
                        {employeeShift
                          ?.filter(
                            (e) =>
                              e.positionId === pos?.positionId && e.status === 1
                          )
                          .map((employee, i) => {
                            return (
                              <div
                                key={"absd" + i}
                                className="py-2 d-flex align-items-center border-bottom"
                              >
                                <div className="d-flex ms-2 align-items-center flex-fill">
                                  <div className="d-flex flex-column ps-2">
                                    <h6 className="fw-bold mb-0">
                                      {employee?.employeeName}
                                    </h6>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default PositionInShift;
