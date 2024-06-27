import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LeftSide from "../components/Auth/LeftSide";

import SignIn from "../components/Auth/SignIn";
import { ToastContainer } from "react-toastify";
import Unauthorized from "../components/Auth/Unauthorized";
import Page404 from "../components/Auth/Page404";
import TimeOut from "../components/Auth/TimeOut";
import ForgotPassword from "../components/Auth/ForgotPassword";

function AuthIndex() {
  return (
    <div className="main p-2 py-3 p-xl-5 ">
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
      <div className="body d-flex p-0 p-xl-5">
        <div className="container-xxl">
          <div className="row g-0">
            <LeftSide />
            <Routes>
              <Route
                path={`${process.env.PUBLIC_URL}/sign-in`}
                element={<SignIn />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/forgot-password`}
                element={<ForgotPassword />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/unauthorized`}
                element={<Unauthorized />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/timeout`}
                element={<TimeOut />}
              />
              <Route
                path={`${process.env.PUBLIC_URL}/page-404`}
                element={<Page404 />}
              />
              <Route path="*" element={<Navigate to="/page-404" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthIndex;
