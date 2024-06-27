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

function LeaveTab(props) {
  const { data, employee, employeeid, storeId } = props;
  const [shiftHistory, setShiftHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(11);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isAcceptModal, setIsAcceptModal] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [shiftId, setShiftId] = useState("");
  const [shiftStatus, setShiftStatus] = useState(0);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if (employeeid) {
      getShiftHistory(shiftStatus);
    }
  }, [employeeid, reducerValue,currentPage]);

  const getShiftHistory = async (status) => {
    try {
      setLoading(true);
      const res = await axiosJWT.get(
        `api/employeeshifthistory/get-employee-shift-histories?StoreId=${storeId}&EmployeeId=${employeeid}&LeaveRequest=true${
          status !== null ? `&RequestStatus=${status}` : ""
        }&Page=${currentPage}&Size=10`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setShiftHistory(res.data.data);
      setTotal(res?.data?.metaData?.total);
    } catch (err) {
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
    const visiblePages = 5; // Adjust the number of visible pages as needed

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
  const handleAllClick = () => {
    setShiftStatus("");
    getShiftHistory("");
  };
  const handleApproveClick = () => {
    setShiftStatus(1);
    getShiftHistory(1);
  };
  const handleRejectClick = () => {
    setShiftStatus(-1);
    getShiftHistory(-1);
  };
  const handlePendingClick = () => {
    setShiftStatus(0);
    getShiftHistory(0);
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
                    src={employee.profileImage}
                    alt="avatar"
                  />
                </a>
                <div className="ms-3">
                  <h6 className="mb-0">{employee.employeeName}</h6>
                  <small className="text-muted">{employee.positionName}</small>
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
                  <LeaveCard
                    key={"fdsfdv" + i}
                    data={shift}
                    setIsAccept={setIsAccept}
                    setIsAcceptModal={setIsAcceptModal}
                    setId={setShiftId}
                  ></LeaveCard>
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
        <NoteModal
          setIsAcceptModal={setIsAcceptModal}
          setIsAccept={setIsAccept}
          isAccept={isAccept}
          show={isAcceptModal}
          onHide={() => setIsAcceptModal(false)}
          id={shiftId}
          foreUpdate={foreUpdate}
        ></NoteModal>
      </TabContainer>
    </div>
  );
}

export default LeaveTab;
