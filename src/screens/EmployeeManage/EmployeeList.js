import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function EmployeeList(props) {
  const {
    setSelectedEmployeeId,
    setSelectedEmployee,
    setIsEmployeeTab,
    setIsRegisterTab,
    setIsLeaveTab,
  } = props;

  const employeeList = useSelector(
    (state) =>
      state.branchs?.currentBranchSelect?.curBranch
        ?.employeeInStoreResponseModels
  )?.filter((e) => e.positionName !== "Store Manager" && e.status !== -1);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  useEffect(() => {
    setSelectedEmployee(employeeList && employeeList[0]);
    setSelectedEmployeeId(employeeList && employeeList[0].employeeId);
  }, []);

  function tabEvents(e, id) {
    e.preventDefault();
    document.getElementById("tab1").classList.remove("active");
    document.getElementById("tab2").classList.remove("active");
    document.getElementById("tab3").classList.remove("active");
    document.getElementById("tab" + id).classList.add("active");

    document.getElementById("tab-conatain1").classList.remove("active");
    document.getElementById("tab-conatain1").classList.add("show");
    document.getElementById("tab-conatain2").classList.remove("active");
    document.getElementById("tab-conatain2").classList.add("show");
    document.getElementById("tab-conatain3").classList.remove("active");
    document.getElementById("tab-conatain3").classList.add("show");
    document.getElementById("tab-conatain" + id).classList.add("active");
    document.getElementById("tab-conatain" + id).classList.add("show");
  }
  return (
    <div
      id="chatMenuList"
      className="card card-chat border-right border-top-0 border-bottom-0 order-0 w420 "
    >
      <div className="px-4 py-3 py-md-4">
        <div
          className="nav nav-pills justify-content-between text-center"
          role="tablist"
        >
          <a
            className="flex-fill rounded border-0 nav-link active"
            data-bs-toggle="tab"
            id="tab1"
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              tabEvents(e, 1);
              setIsEmployeeTab(true);
              setIsLeaveTab(false);
              setIsRegisterTab(false);
            }}
            role="tab"
            aria-selected="true"
          >
            Timetable
          </a>
          <a
            className="flex-fill rounded border-0 nav-link"
            data-bs-toggle="tab"
            id="tab2"
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              tabEvents(e, 2);
              setIsEmployeeTab(false);
              setIsLeaveTab(false);
              setIsRegisterTab(true);
            }}
            role="tab"
            aria-selected="false"
          >
            Registration
          </a>
          <a
            className="flex-fill rounded border-0 nav-link"
            data-bs-toggle="tab"
            id="tab3"
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              tabEvents(e, 3);
              setIsEmployeeTab(false);
              setIsRegisterTab(false);
              setIsLeaveTab(true);
            }}
            role="tab"
            aria-selected="false"
          >
            Leave Request
          </a>
        </div>
      </div>
      <div className="tab-content border-top">
        <div
          className="tab-pane fade show active"
          id="tab-conatain1"
          role="tabpanel"
        >
          <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
            {employeeList?.map((d, i) => {
              return (
                <li
                  key={"545" + i}
                  className={`list-group-item px-md-4 py-3 py-md-4 ${
                    activeChatIndex === i ? "open" : ""
                  }`}
                >
                  <a
                    className="py-2 d-flex justify-content-between align-items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveChatIndex(i);
                      setSelectedEmployee(d);
                      setSelectedEmployeeId(d.employeeId);
                    }}
                  >
                    <div className="col-2">
                      <img
                        className="avatar lg rounded-circle"
                        src={d.profileImage}
                        alt=""
                      />
                    </div>
                    <div className="ms-3 col-7 ps-2 ">
                      <h6 className="d-flex justify-content-between align-items-center word-wrap">
                        <span>{d.employeeName}</span>{" "}
                      </h6>
                      <span className="text-muted">{d.typeName}</span>
                    </div>
                    <div className="col-3 d-flex justify-content-end align-items-center">
                      <span className="msg-time text-end">
                        {d.positionName}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="tab-pane fade" id="tab-conatain2" role="tabpanel">
          <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
            {employeeList?.map((d, i) => {
              return (
                <li
                  key={"545" + i}
                  className={`list-group-item px-md-4 py-3 py-md-4 ${
                    activeChatIndex === i ? "open" : ""
                  }`}
                >
                  <a
                    className="py-2 d-flex justify-content-between align-items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveChatIndex(i);
                      setSelectedEmployee(d);
                      setSelectedEmployeeId(d.employeeId);
                    }}
                  >
                    <div className="col-2">
                      <img
                        className="avatar lg rounded-circle"
                        src={d.profileImage}
                        alt=""
                      />
                    </div>
                    <div className="ms-3 col-7 ps-2 ">
                      <h6 className="d-flex justify-content-between align-items-center word-wrap">
                        <span>{d.employeeName}</span>{" "}
                      </h6>
                      <span className="text-muted">{d.typeName}</span>
                    </div>
                    <div className="col-3 d-flex justify-content-end align-items-center">
                      <span className="msg-time text-end">
                        {d.positionName}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="tab-pane fade" id="tab-conatain3" role="tabpanel">
          <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
            {employeeList?.map((d, i) => {
              return (
                <li
                  key={"545" + i}
                  className={`list-group-item px-md-4 py-3 py-md-4 ${
                    activeChatIndex === i ? "open" : ""
                  }`}
                >
                  <a
                    className="py-2 d-flex justify-content-between align-items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveChatIndex(i);
                      setSelectedEmployee(d);
                      setSelectedEmployeeId(d.employeeId);
                    }}
                  >
                    <div className="col-2">
                      <img
                        className="avatar lg rounded-circle"
                        src={d.profileImage}
                        alt=""
                      />
                    </div>
                    <div className="ms-3 col-7 ps-2 ">
                      <h6 className="d-flex justify-content-between align-items-center word-wrap">
                        <span>{d.employeeName}</span>{" "}
                      </h6>
                      <span className="text-muted">{d.typeName}</span>
                    </div>
                    <div className="col-3 d-flex justify-content-end align-items-center">
                      <span className="msg-time text-end">
                        {d.positionName}
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
