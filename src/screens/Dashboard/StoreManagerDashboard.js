import React, { useEffect, useState } from "react";
import InterviewCard from "../../components/Dashboard/InterviewCard";
import BrandInfoSmallcard from "../../components/Dashboard/BrandInfoSmallcard";
import {
  getEmployeePosition,
  getEmployeeType,
} from "../../redux/employee/employeeApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import {
  getDashboardStoreManager,
} from "../../redux/dashboard/dashboardApi";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import EmployeePositionChart from "./Hr/EmployeePositionChart";
import TotalHoursWork from "./Hr/TotalHoursWork";
import EmployeeTodayAvailable from "./Hr/EmployeeTodayAvailable";
import { getCurBranchSelect } from "../../redux/branch/branchApi";
import StoreWorkHoursTable from "./StoreManager/StoreWorkHoursTable";
import * as XLSX from 'xlsx';
import TopPerformers from "../../components/Dashboard/TopPerformers";
import PageHeader from "../../components/common/PageHeader";
import TopEmployeePerformer from "./StoreManager/TopEmployeePerformer";
import TopEmployeeNotPerformer from "./StoreManager/TopEmployeeNotPerformer";
import EmployeeDashboardDetails from "./StoreManager/EmployeeDashboardDetails";

function StoreManagerDashboard() {
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const storeid = localStorage.getItem('storeid');
  const loading = useSelector(
    (state) => state.dashboard?.dashboard?.isFetching
  );
  const dashboard = useSelector(
    (state) => state.dashboard?.dashboard?.dashboard
  );
  const dashBoardCommonFields = useSelector(
    (state) => state.dashboard?.dashboard?.dashboard?.dashBoardCommonFields
  );
  const employeeStatistics = useSelector(
    (state) => state.dashboard?.dashboard?.dashboard?.employeeStatistics
  )?.filter((data) => data.employeeName !== localStorage.getItem('name'));
  const [day, setDay] = useState("Today");
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [isDetailsModal, setIsDetailsModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getCurBranchSelect(
        storeid,
        dispatch,
        user?.data?.token?.accessToken,
        axiosJWT
      );
      getEmployeeType(dispatch, user?.data?.token?.accessToken, axiosJWT);
      getEmployeePosition(dispatch, user?.data?.token?.accessToken, axiosJWT);
      getDashboardStoreManager(
        storeid,
        user?.data?.token?.accessToken,
        dispatch,
        axiosJWT
      );
    }
  }, []);
  const generateExcel = () => {
    const storeDataWs = XLSX.utils.json_to_sheet([
      { ...dashboard?.dashBoardCommonFields },
    ]);
    const positionStatisticsSheet = XLSX.utils.json_to_sheet(dashboard.totalPositions);
    // Convert Employee Statistics to worksheet
    const employeeStatsWs = XLSX.utils.json_to_sheet(
      dashboard?.employeeStatistics.map(employee => ({
        employeeId: employee.employeeId,
        employeeName: employee.employeeName,
        totalMonthWorkDuration: employee.totalMonthWorkDuration,
        // ... (other fields)
      }))
    );

    const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, storeDataWs, 'StoreData');
      XLSX.utils.book_append_sheet(wb, positionStatisticsSheet, 'PositionStatistics');
      XLSX.utils.book_append_sheet(wb, employeeStatsWs, 'EmployeeStatistics');

      // Save the Excel file
      XLSX.writeFile(wb, 'store_data_with_employee_stats.xlsx');
  };
  return (
    <div className="container-xxl">
      <PageHeader
          headerTitle=""
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                <button
                  className="btn btn-dark btn-set-task w-sm-100 me-2"
                  onClick={() => {
                    generateExcel()
                  }}
                >
                  <i className="icofont-edit me-2 fs-6"></i>Generate Report
                </button>
              </div>
            );
          }}
        />
      {loading ? (
        <GrowingSpinner></GrowingSpinner>
      ) : (
        <>
          <div className="row g-3 mb-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 row-cols-xxl-4">
            <div className="col">
              <BrandInfoSmallcard
                title="Total Work Progess"
                value={dashBoardCommonFields?.totalMonthWorkProgress}
                iconClass="icofont-data fs-3"
              />
            </div>
            <div className="col">
              <BrandInfoSmallcard
                title="Total Attendance"
                value={dashBoardCommonFields?.totalMonthAttendance}
                iconClass="icofont-chart-flow fs-3"
              />
            </div>
            <div className="col">
              <BrandInfoSmallcard
                title="Total Leave"
                value={dashBoardCommonFields?.totalMonthLeaveApplication}
                iconClass="icofont-chart-flow-2 fs-3"
              />
            </div>
            <div className="col">
              <BrandInfoSmallcard
                title="Total Absent"
                value={dashBoardCommonFields?.totalMonthAttendanceAbsent}
                iconClass="icofont-tasks fs-3"
              />
            </div>
          </div>

          <div className="row clearfix g-3">
            <div className="col-xl-8 col-lg-12 col-md-12 flex-column">
              <div className="row g-3">
                <div className="col-md-6">
                  <EmployeeTodayAvailable
                    dashboard={dashboard}
                    attendance={
                      day === "Today"
                        ? dashBoardCommonFields?.totalTodayAttendanceQualified
                        : dashBoardCommonFields?.totalMonthAttendanceQualified
                    }
                    notIntime={
                      day === "Today"
                        ? dashBoardCommonFields?.totalTodayAttendanceNotOnTime
                        : dashBoardCommonFields?.totalMonthAttendanceNotOnTime
                    }
                    absent={
                      day === "Today"
                        ? dashBoardCommonFields?.totalTodayAttendanceAbsent
                        : dashBoardCommonFields?.totalMonthAttendanceAbsent
                    }
                    leave={
                      day === "Today"
                        ? dashBoardCommonFields?.totalTodayLeaveApplicationApproved
                        : dashBoardCommonFields?.totalMonthLeaveApplicationApproved
                    }
                    setDay={setDay}
                    day={day}
                  />
                </div>
                <div className="col-md-6">
                  <EmployeePositionChart
                    Title="Total Employees"
                    data={dashboard}
                    TitleRight={dashboard?.totalStoreEmployee}
                    identity="totalemployee"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-12 col-md-12">
              <div className="row g-3">
                <div className="col-md-6 col-lg-6 col-xl-12">
                  <TotalHoursWork dashboard={dashBoardCommonFields} />
                </div>
                <div className="col-md-6 col-lg-6 col-xl-12 flex-column">
                  <InterviewCard
                    value={dashBoardCommonFields?.totalMonthWorkDurationFinished?.toFixed(
                      1
                    )}
                    iconClass="icofont-clock-time fs-3"
                    label="Total Work Hours Finish"
                    chartClass="icofont-sand-clock fs-3 text-muted"
                  />
                  <InterviewCard
                    value={dashBoardCommonFields?.totalTodayWorkDurationFinished?.toFixed(
                      1
                    )}
                    iconClass="icofont-clock-time fs-3"
                    label="Today Work Hours Finish"
                    chartClass="icofont-sand-clock fs-3 text-muted"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row clearfix g-3">
          <div className="col-6">
            <TopEmployeePerformer
              employees={employeeStatistics}
            ></TopEmployeePerformer>
            </div>
          <div className="col-6">
            <TopEmployeeNotPerformer
              employees={employeeStatistics}
            ></TopEmployeeNotPerformer>
            </div>
            <StoreWorkHoursTable
              dashboard={employeeStatistics}
              setEmployeeId={setEmployeeId}
              setName={setName}
              setIsDetailsModal={setIsDetailsModal}
            ></StoreWorkHoursTable>
          </div>
      </>
      )}
      <EmployeeDashboardDetails
        show={isDetailsModal}
        onHide={()=>setIsDetailsModal(false)}
        id={employeeId}
        name={name}
      ></EmployeeDashboardDetails>
    </div>
  );
}

export default StoreManagerDashboard;
