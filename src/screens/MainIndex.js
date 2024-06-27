import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "../components/common/Header";
import HrDashboard from "./Dashboard/HrDashboard";
import Holidays from "./Employee/Holidays";
import Members from "./Employee/Members";
import TicketsDetail from "./Tickets/TicketsDetail";
import TicketsView from "./Tickets/TicketsView";
import Calendar from "./App/Calendar";
import PageHeader1 from "../components/common/PageHeader1";
import MemberProfile from "./Employee/MemberProfile";
import Stores from "./Store/Store";
import Branch from "./Employee/Branch";
import StoreDetail from "./Store/StoreDetail";
import { ToastContainer } from "react-toastify";
import StoreForManager from "./Store/store/StoreForManager";
import Accounts from "./Accounts/account";
import Brands from "./Brand/brands";
import BrandDetails from "./Brand/brandDetails";
import Profile from "./Profile/profile";
import StoreManagerTicket from "./Tickets/StoreManagerTicket";
import ShiftDetails from "./Shift/ShiftDetails";
import Employee from "./EmployeeManage/Employee";
import { useSelector } from "react-redux";
import CalendarList from "./App/CalendarList";
import MyBrandDetails from "./Brand/Brand-HR/MyBrandDetails";
import StoreManagerDashboard from "./Dashboard/StoreManagerDashboard";
import Attendance from "./Attendance/Attendance";
import BrandInformationTab from "./Brand/Brand-HR/BrandInformationTab";

function MainIndex(props) {
  const { activekey } = props;

  const isAuthenticated = useSelector(
    (state) => state.auth?.login?.currentUser
  ); // Replace with your authentication state
  const userRole = localStorage.getItem("role"); // Replace with the user's role from authentication

  const PrivateRoute = ({ path, roles, element: Element }) => {
    const isAuthorized = isAuthenticated && roles.includes(userRole);
    if (!isAuthenticated) {
      return <Navigate to="/timeout" replace />;
    }
    return isAuthorized ? <Element /> : <Navigate to="/unauthorized" replace />;
  };
  return (
    <div className="main px-lg-4 px-md-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {activekey !== "/chat-app" ? (
        activekey === "/documentation" ? (
          <PageHeader1 />
        ) : (
          <Header />
        )
      ) : (
        ""
      )}
      <div className="body d-flex py-lg-3 py-md-2">
        <Routes>
          <Route
            path={`${process.env.PUBLIC_URL}/`}
            element={<HrDashboard />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/hr-dashboard`}
            element={<PrivateRoute roles={["2"]} element={HrDashboard} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/manager-dashboard`}
            element={<PrivateRoute roles={["3"]} element={StoreManagerDashboard} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/stores`}
            element={<PrivateRoute roles={["2"]} element={Stores} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/shift/:id`}
            element={<PrivateRoute roles={["3"]} element={ShiftDetails} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/accounts`}
            element={<PrivateRoute roles={["1"]} element={Accounts} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/stores/:id`}
            element={<PrivateRoute roles={["2"]} element={StoreDetail} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/store`}
            element={<PrivateRoute roles={["3"]} element={StoreForManager} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/ticket`}
            element={
              <PrivateRoute roles={["3"]} element={StoreManagerTicket} />
            }
          />
          <Route
            path={`${process.env.PUBLIC_URL}/brand`}
            element={<PrivateRoute roles={["2"]} element={BrandInformationTab} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/brands`}
            element={<PrivateRoute roles={["1"]} element={Brands} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/brands/:id`}
            element={<PrivateRoute roles={["1"]} element={BrandDetails} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/application`}
            element={<TicketsView />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/application/:id`}
            element={<TicketsDetail />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/tasks`}
            element={<PrivateRoute roles={["3"]} element={Employee} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/members`}
            element={<PrivateRoute roles={["2"]} element={Members} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/members/:id`}
            element={<PrivateRoute roles={["2","3"]} element={MemberProfile} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/profile`}
            element={<Profile />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/holidays`}
            element={<PrivateRoute roles={["2"]} element={Holidays} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/attendance`}
            element={<Attendance />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/branch`}
            element={<PrivateRoute roles={["3"]} element={Branch} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/calander/:id`}
            element={<PrivateRoute roles={["2", "3"]} element={Calendar} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/calander`}
            element={<PrivateRoute roles={["3"]} element={CalendarList} />}
          />
          <Route
            path={`${process.env.PUBLIC_URL}/brand-info`}
            element={<PrivateRoute roles={["2"]} element={MyBrandDetails} />}
          />
          <Route path="*" element={<Navigate to="/page-404" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainIndex;
