import React, { useEffect, useState } from "react";
import InterviewCard from "../../components/Dashboard/InterviewCard";
import BrandInfoSmallcard from "../../components/Dashboard/BrandInfoSmallcard";
import {
  getEmployeePosition,
  getEmployeeType,
} from "../../redux/employee/employeeApi";
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { getDashboardHr } from "../../redux/dashboard/dashboardApi";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import EmployeePositionChart from "./Hr/EmployeePositionChart";
import TotalHoursWork from "./Hr/TotalHoursWork";
import EmployeeTodayAvailable from "./Hr/EmployeeTodayAvailable";
import BrandWorkHoursTable from "./Hr/BrandWorkHoursTable";
import PageHeader from "../../components/common/PageHeader";

function HrDashboard() {
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const loading = useSelector(
    (state) => state.dashboard?.dashboard?.isFetching
  );
  const dashboard = useSelector(
    (state) => state.dashboard?.dashboard?.dashboard
  );
  const dashBoardCommonFields = useSelector(
    (state) => state.dashboard?.dashboard?.dashboard?.dashBoardCommonFields
  );
  const totalStoreStatistics = useSelector(
    (state) => state.dashboard?.dashboard?.dashboard?.totalStoreStatistics
  );
  const [day, setDay] = useState('Today');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getEmployeeType(dispatch, user?.data?.token?.accessToken, axiosJWT);
      getEmployeePosition(dispatch, user?.data?.token?.accessToken, axiosJWT);
      getDashboardHr(user?.data?.token?.accessToken, dispatch, axiosJWT);
    }
  }, []);
  const generateExcel = () => {
    const jsonData = dashboard; // Replace with your actual JSON data

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Add sheets to the workbook
  const dashboardSheetData = Object.entries(jsonData.dashBoardCommonFields);
  const dashboardSheet = XLSX.utils.aoa_to_sheet(dashboardSheetData);
  const positionStatisticsSheet = XLSX.utils.json_to_sheet(jsonData.totalPositions);
  jsonData.totalStoreStatistics.forEach((store) => {
      const employeeStatisticsSheet = XLSX.utils.json_to_sheet(store.employeeStatistics);
      XLSX.utils.book_append_sheet(workbook, employeeStatisticsSheet, `${store.storeName}`);
  });
  // Add sheets to the workbook
  // XLSX.utils.book_append_sheet(workbook, employeeStatisticsSheet, 'Employee Statistics');
  XLSX.utils.book_append_sheet(workbook, dashboardSheet, 'Brand Statistics');
  XLSX.utils.book_append_sheet(workbook, positionStatisticsSheet, 'Position-wise Statistics');

  // Save the workbook to an Excel file
  XLSX.writeFile(workbook, 'brand-statistic.xlsx');
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
                    attendance={day === 'Today' ? dashBoardCommonFields?.totalTodayAttendanceQualified : dashBoardCommonFields?.totalMonthAttendanceQualified}
                    notIntime={day === 'Today' ? dashBoardCommonFields?.totalTodayAttendanceNotOnTime : dashBoardCommonFields?.totalMonthAttendanceNotOnTime}
                    absent={day === 'Today' ? dashBoardCommonFields?.totalTodayAttendanceAbsent : dashBoardCommonFields?.totalMonthAttendanceAbsent}
                    leave={day === 'Today' ? dashBoardCommonFields?.totalTodayLeaveApplicationApproved : dashBoardCommonFields?.totalMonthLeaveApplicationApproved}
                    setDay={setDay}
                    day={day}
                  />
                </div>
                <div className="col-md-6">
                  <EmployeePositionChart
                    Title="Total Employees"
                    data={dashboard}
                    TitleRight={dashboard?.totalBrandEmployee}
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
                    value={dashBoardCommonFields?.totalMonthWorkDurationFinished?.toFixed(1)}
                    iconClass="icofont-clock-time fs-3"
                    label="Total Work Hours Finish"
                    chartClass="icofont-sand-clock fs-3 text-muted"
                  />
                  <InterviewCard
                    value={dashBoardCommonFields?.totalTodayWorkDurationFinished?.toFixed(1)}
                    iconClass="icofont-clock-time fs-3"
                    label="Today Work Hours Finish"
                    chartClass="icofont-sand-clock fs-3 text-muted"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row clearfix g-3">
            <BrandWorkHoursTable
              dashboard={totalStoreStatistics}
            ></BrandWorkHoursTable>
          </div>
        </>
      )}
    </div>
  );
}

export default HrDashboard;
