import React from "react";
import { chatAppData } from "../../components/Data/AppData";
import Chattile from "../../components/Pages/Chattile";
import EmployeeList from "./EmployeeList";
import EmployeeSchedule from "./EmployeeSchedule";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/auth/authSlice";
import { createAxios } from "../../createInstance";
import { getCurBranchSelect } from "../../redux/branch/branchApi";
import { useState } from "react";
import LeaveTab from "./LeaveTab";
import EmployeeWorkRegistrasionTab from "./EmployeeWorkRegistrasionTab";

function Employee() {
  const storeId = localStorage.getItem("storeid");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isEmployeeTab, setIsEmployeeTab] = useState(true);
  const [isRegisterTab, setIsRegisterTab] = useState(false);
  const [isLeaveTab, setIsLeaveTab] = useState(false);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    getCurBranchSelect(
      storeId,
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
  }, []);
  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <div className="col-12 d-flex">
          <EmployeeList
            data={chatAppData}
            setSelectedEmployee={setSelectedEmployee}
            selectedEmployeeId={selectedEmployeeId}
            setSelectedEmployeeId={setSelectedEmployeeId}
            setIsLeaveTab={setIsLeaveTab}
            setIsRegisterTab={setIsRegisterTab}
            setIsEmployeeTab={setIsEmployeeTab}
          />
          {isEmployeeTab ? (
            <EmployeeSchedule
              data={chatAppData}
              employee={selectedEmployee}
              employeeid={selectedEmployeeId}
              storeId={storeId}
            ></EmployeeSchedule>
          ) : null}
          {isLeaveTab ? (
            <LeaveTab
              data={chatAppData}
              employee={selectedEmployee}
              employeeid={selectedEmployeeId}
              storeId={storeId}
            ></LeaveTab>
          ) : null}
          {isRegisterTab ? (
            <EmployeeWorkRegistrasionTab
              data={chatAppData}
              employee={selectedEmployee}
              employeeid={selectedEmployeeId}
              storeId={storeId}
            ></EmployeeWorkRegistrasionTab>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Employee;
