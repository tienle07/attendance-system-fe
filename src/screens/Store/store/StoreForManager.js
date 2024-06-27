import React, { useReducer, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Nav, TabContainer } from "react-bootstrap";
import StoreDetailCard from "../../../components/Projects/StoreDetailCard";
import { getWorkSchedule } from "../../../redux/workschedule/workscheduleApi";
import { getCurBranchSelect } from "../../../redux/branch/branchApi";
import {
  getCurEmployeeSelect,
  getEmployeePosition,
} from "../../../redux/employee/employeeApi";
import CurrentStoreWorkSchedule from "./CurrentStoreWorkSchedule";
import GrowingSpinner from "../../../components/UI/GrowingSpinner";
import PageHeader from "../../../components/common/PageHeader";
import NewEmployeeNotification from "../NewEmployeeNotification";
import { loginSuccess } from "../../../redux/auth/authSlice";
import { createAxios } from "../../../createInstance";
var columnsT = "";
function StoreForManager() {
  const id = localStorage.getItem("storeid");

  const [newEmployeeId, setNewEmployeeId] = useState([]);
  const [employeeComingModal, setEmployeeComingModal] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [employeeListWithStatus, setemployeeListWithStatus] = useState("2");
  const [pending, setPending] = useState(false);

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const data = useSelector(
    (state) => state.branchs?.currentBranchSelect?.curBranch?.storeResponseModel
  );
  const isGetBranch = useSelector(
    (state) => state.branchs?.currentBranchSelect?.isFetching
  );

  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getAsyns();
    }
  }, [reducerValue]);
  const getAsyns = async () => {
    setPending(true);
    await checkNewEmployee();
    await getCurBranchSelect(
      id,
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
    await fetchEmployees("", 1, 2,perPage);
    await getWorkSchedule(
      id,
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
    await getEmployeePosition(
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
    setPending(false);
  };
  const checkNewEmployee = async () => {
    try {
      const response = await axiosJWT.get(
        `/api/employeeinstore/manager-get-employees-in-store?StoreId=${id}&Status=0`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (response?.data?.data?.length > 0) {
        setEmployeeComingModal(true);
        const listId = response?.data?.data?.map((e) => {
          return e.id;
        });
        setNewEmployeeId(listId);
      } else {
        setEmployeeComingModal(false);
        setNewEmployeeId([]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  columnsT = [
    {
      name: "Code",
      selector: (row) => row.employeeCode,
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Name",
      selector: (row) => row.employeeName,
      sortable: true,
      minWidth: "180px",
    },
    {
      name: "Position",
      selector: (row) => row.positionName,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.typeName,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {},
      sortable: true,
      cell: (row) =>
        row.status === 2 ? (
          <span className="badge bg-success">Working</span>
        ) : row.status === 1 ? (
          <span className="badge bg-warning">Pending</span>
        ) : row.status === 0 ? (
          <span className="badge bg-primary">New</span>
        ) : (
          <span className="badge bg-danger">Not Working</span>
        ),
    },
  ];
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      setSearch(e.target.value);
      fetchEmployees(e.target.value, 1, employeeListWithStatus,perPage);
    }
  };
  const handleAllClick = () => {
    setemployeeListWithStatus(null);
    fetchEmployees("", 1, null,perPage);
  };
  const handleActiveClick = () => {
    setemployeeListWithStatus(2);
    fetchEmployees("", 1, 2,perPage);
  };
  const handleNonActiveClick = () => {
    setemployeeListWithStatus(-1);
    fetchEmployees("", 1, -1,perPage);
  };
  const handleNewClick = () => {
    setemployeeListWithStatus(0);
    fetchEmployees("", 1, 0,perPage);
  };
  const handlePendingClick = () => {
    setemployeeListWithStatus(1);
    fetchEmployees("", 1, 1,perPage);
  };
  const handlePageChange = (page) => {
    fetchEmployees(search, page, employeeListWithStatus,perPage);
  };

  const handlePerRowsChange = async (newPerPage) => {
    console.log(newPerPage)
    setLoading(true);
    setPerPage(newPerPage);
    fetchEmployees("", 1, employeeListWithStatus,newPerPage);
    setLoading(false);
  };
  const fetchEmployees = async (search, page, status,perpage) => {
    setLoading(true);
    try {
      if (search) {
        const response = await axiosJWT.get(
          `/api/employeeinstore/manager-get-employees-in-store?StoreId=${id}&EmployeeName=${search}&Page=${
            page ? page : 1
          }&Size=${perpage}&delay=1${status != null ? `&Status=${status}` : ""}`,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        setEmployees(response.data.data);
        setTotalRows(response.data.metaData.total);
      } else {
        const response = await axiosJWT.get(
          `/api/employeeinstore/manager-get-employees-in-store?StoreId=${id}&Page=${
            page ? page : 1
          }&Size=${perpage}&delay=1${status != null ? `&Status=${status}` : ""}`,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        setEmployees(response.data.data);
        setTotalRows(response.data.metaData.total);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <div className="container-xxl">
      {isGetBranch && pending && <GrowingSpinner></GrowingSpinner>}
      {!isGetBranch && !pending && (
        <div>
          <PageHeader headerTitle={data?.storeName} />
          <div className="row g-3">
            <div className="col-xl-8 col-lg-12 col-md-12">
              <StoreDetailCard
                storeName={data?.storeName}
                address={data?.address}
                mng={data?.storeManager}
                active={data?.active}
                id={data?.id}
                bssid={data?.bssid}
                openTime={data?.openTime}
                closeTime={data?.closeTime}
                latitude={data?.latitude}
                longtitude={data?.longitude}
                createDate={data?.createDate}
                role={user?.data?.account?.roleId}
              />
              <TabContainer defaultActiveKey="Working">
                <div className="row g-3">
                  <div className="col-xl-5 col-lg-12 col-md-12">
                    <div className="input-group flex-nowrap input-group-lg ">
                      <button
                        type="button"
                        className="input-group-text"
                        id="addon-wrapping"
                      >
                        <i className="fa fa-search"></i>
                      </button>
                      <input
                        type="search"
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          handleSearch(e);
                        }}
                        placeholder="Search"
                        aria-label="search"
                        aria-describedby="addon-wrapping"
                      />
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-12 col-md-12 d-flex  justify-content-center align-items-center">
                    <div className="flex-row-reverse">
                      <Nav
                        variant="pills"
                        className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100 d-reverse"
                      >
                        <Nav.Item>
                          <Nav.Link
                            eventKey="Working"
                            onClick={handleActiveClick}
                          >
                            Working
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="NotWorking"
                            onClick={handleNonActiveClick}
                          >
                            NotWorking
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="New" onClick={handleNewClick}>
                            New
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link
                            eventKey="Pending"
                            onClick={handlePendingClick}
                          >
                            Pending
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
                  <div className="col-md-12">
                    <DataTable
                      progressPending={loading}
                      title="Employees"
                      columns={columnsT}
                      data={employees ? employees : []}
                      defaultSortField="title"
                      pagination
                      paginationServer
                      paginationTotalRows={totalRows}
                      onChangeRowsPerPage={handlePerRowsChange}
                      paginationRowsPerPageOptions={[5, 10, 25, 50]}
                      paginationPerPage={5}
                      onChangePage={handlePageChange}
                      selectableRows={false}
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                      onRowClicked={(e) => {
                        getCurEmployeeSelect(
                          e.employeeId,
                          dispatch,
                          user?.data?.token?.accessToken
                        );
                        navigate(
                          process.env.PUBLIC_URL + "/members/" + e.employeeId
                        );
                      }}
                    />
                  </div>
                </div>
              </TabContainer>
            </div>
            <div className="col-xl-4 col-lg-12 col-md-12">
              <CurrentStoreWorkSchedule id={id} fore={foreUpdate} />
            </div>
          </div>
          <NewEmployeeNotification
            show={employeeComingModal}
            onClose={() => setEmployeeComingModal(false)}
            listId={newEmployeeId}
            foreUpdate={foreUpdate}
            setEmployeeComingModal={setEmployeeComingModal}
          ></NewEmployeeNotification>
        </div>
      )}
    </div>
  );
}

export default StoreForManager;
