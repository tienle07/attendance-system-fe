import React, { useState } from "react";
import Avatar2 from "../../../assets/images/lg/avatar2.jpg";
import { useSelector } from "react-redux";

function TopEmployeePerformer(props) {
  const { employees } = props;
  const [sortBy, setSortBy] = useState("totalMonthWorkDurationFinished");
  const [sortOrder, setSortOrder] = useState("desc");
  const employeeList = useSelector(
    (state) =>
      state.branchs?.currentBranchSelect?.curBranch
        ?.employeeInStoreResponseModels
  )?.filter((e) => e.positionName !== "Store Manager" && e.status !== -1);
  const sortedEmployee = employees && [...employees].filter((emp)=>emp.employeeName !== localStorage.getItem('name')).sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    return a[sortBy] > b[sortBy] ? order : -order;
  });
  const handleSort = (criteria) => {
    if (criteria === sortBy) {
      // If clicking on the same criteria, reverse the order
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // If clicking on a different criteria, set the new criteria and default to ascending order
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };
  const findImageById = (id)=>{
    const employee = employeeList?.find((emp) => emp.employeeId === id)
    return employee?.profileImage
  }
  const findCodeById = (id)=>{
    const employee = employeeList?.find((emp) => emp.employeeId === id)
    return employee?.employeeCode
  }
  return (
    <div className="card light-success-bg">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Top Performers</h6>
      </div>
      <div className="card-body">
        <div className="row g-3 align-items-center">
          <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row d-flex justify-content-end g-3 row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-3 row-cols-xxl-3 row-deck top-perfomer">
              {sortedEmployee?.slice(0,3).map((item,i) => (
                <div className="col" key={'3323'+i}>
                  <div className="card shadow">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <img
                        className="avatar lg rounded-circle img-thumbnail mx-auto"
                        src={findImageById(item?.employeeId)}
                        alt="profile"
                      />
                      <h6 className="fw-bold my-2 small-14">{item?.employeeName}</h6>
                      <span className="text-muted mb-2">{findCodeById(item?.employeeId)}</span>
                      <h4 className="fw-bold text-primary fs-3">{item?.totalMonthWorkDurationFinished}h</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopEmployeePerformer;
