import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import LeaveCard from "./LeaveCard";
import NoteModal from "./NoteModal";
import { useReducer } from "react";
import { Nav, TabContainer } from "react-bootstrap";
import RegistrationCard from "./RegistrationCard";

function EmployeeWorkRegistrasionTab(props) {
  const { data, employee, employeeid, storeId } = props;
  const storeid = localStorage.getItem("storeid");
  const [shiftHistory, setShiftHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(11);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [shiftStatus, setShiftStatus] = useState(0);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (employeeid) {
      getWorkRegistration(shiftStatus);
    }
  }, [employeeid, reducerValue, currentPage]);

  const getWorkRegistration = async (status) => {
    try {
      setLoading(true);
      const res = await axiosJWT.get(
        `api/employeeshift/get-work-registration?StoreId=${storeId}&EmployeeId=${employeeid}${
          status !== null ? `&Status=${status}` : ""
        }&Page=${currentPage}&Size=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setShiftHistory(res?.data.data);
      setTotal(res?.data?.metaData?.total);
    } catch (err) {
      console.error(err);
      toast.error("" + err?.response?.data?.message);
    }
    setLoading(false);
  };
  const getTotalPages = () => Math.ceil(total / pageSize) || 1;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };
  const renderPageTabs = () => {
    const totalPages = getTotalPages();
    const tabs = [];
    const visiblePages = 5;

    for (
      let i = Math.max(1, currentPage - Math.floor(visiblePages / 2));
      i <= Math.min(totalPages, currentPage + Math.floor(visiblePages / 2));
      i++
    ) {
      tabs.push(
        <li className="page-item">
          <a
            onClick={() => handlePageChange(i)}
            className={`page-link ${currentPage === i ? "active" : ""}`}
          >
            {i}
          </a>
        </li>
      );
    }

    if (currentPage - Math.floor(visiblePages / 2) > 1) {
      tabs.unshift(<li className={`page-link`}>...</li>);
    }

    if (currentPage + Math.floor(visiblePages / 2) < totalPages) {
      tabs.push(<li className={`page-link`}>...</li>);
    }

    return tabs;
  };
  const handlePostStatus = async (newStatus) => {
    try {
      const res = await axiosJWT.put(
        "api/employeeinstore/store-manager-update-employee-in-store-status",
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleAccept = async (empshiftid) => {
    try {
      const res = await axiosJWT.put(
        "api/employeeshift/manager-approve-registration/" + empshiftid,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (employee?.status !== 2) {
        const newStatus = {
          employeeInStoreId: employee?.id,
          storeId: storeid,
          status: 2,
        };
        handlePostStatus(newStatus);
      }
      toast.success("Accept Successfully");
      foreUpdate();
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleReject = async (empshiftid) => {
    try {
      const res = await axiosJWT.put(
        "/api/employeeshift/manager-reject-registration/" + empshiftid,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      toast.success("Reject Successfully");
      foreUpdate();
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleAllClick = () => {
    setShiftStatus("");
    setCurrentPage(1);
    getWorkRegistration("");
  };
  const handleApproveClick = () => {
    setShiftStatus(1);
    setCurrentPage(1);
    getWorkRegistration(1);
  };
  const handleRejectClick = () => {
    setShiftStatus(-1);
    setCurrentPage(1);
    getWorkRegistration(-1);
  };
  const handlePendingClick = () => {
    setShiftStatus(0);
    setCurrentPage(1);
    getWorkRegistration(0);
  };
  return (
    <div className="card card-chat-body border-0 order-1 w-100 px-4 px-md-5 py-3 py-md-4">
      <TabContainer defaultActiveKey="Pending">
        {loading && <GrowingSpinner></GrowingSpinner>}
        {!loading && (
          <>
            <div className="chat-header d-flex justify-content-between align-items-center border-bottom pb-3">
              <div className="d-flex">
                <a href="#!" title="">
                  <img
                    className="avatar rounded"
                    src={employee?.profileImage}
                    alt="avatar"
                  />
                </a>
                <div className="ms-3">
                  <h6 className="mb-0">{employee?.employeeName}</h6>
                  <small className="text-muted">{employee?.positionName}</small>
                </div>
              </div>
              <div className="d-flex">
                <Nav
                  variant="pills"
                  className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100 d-reverse"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="Pending" onClick={handlePendingClick}>
                      Pending
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Approved" onClick={handleApproveClick}>
                      Approved
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Rejected" onClick={handleRejectClick}>
                      Rejected
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="All" onClick={handleAllClick}>
                      All
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            </div>
            <ul
              id="chatHistory"
              className="chat-history list-unstyled mb-0 py-lg-5 py-md-4 py-3 flex-grow-1"
            >
              {shiftHistory?.map((shift, i) => {
                return (
                  <RegistrationCard
                    key={"fdsfdv" + i}
                    data={shift}
                    handleAccept={handleAccept}
                    handleReject={handleReject}
                  ></RegistrationCard>
                );
              })}
            </ul>
            <div className="d-flex flex-row-reverse">
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li className="page-item">
                    <a
                      className="page-link"
                      onClick={() => handlePageChange(1)}
                    >
                      <span>«</span>
                    </a>
                  </li>
                  {renderPageTabs()}
                  <li className="page-item">
                    <a
                      className="page-link"
                      onClick={() => handlePageChange(getTotalPages())}
                    >
                      <span>»</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </>
        )}
      </TabContainer>
    </div>
  );
}

export default EmployeeWorkRegistrasionTab;
