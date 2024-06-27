import React, { useReducer, useState } from "react";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import StoreDetailCard from "../../components/Projects/StoreDetailCard";
import { useDispatch, useSelector } from "react-redux";
import { getCurBranchSelect } from "../../redux/branch/branchApi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  getCurEmployeeSelect,
  getEmployeePosition,
  getEmployeeType,
  getListEmployeeForAdd,
  getListEmployeeForPromte,
} from "../../redux/employee/employeeApi";
import { Modal, Nav, TabContainer } from "react-bootstrap";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import CurrentStoreWorkSchedule from "./store/CurrentStoreWorkSchedule";
import { getWorkSchedule } from "../../redux/workschedule/workscheduleApi";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import DeleteEmployeeInStoreModal from "./store/DeleteEmployeeInStoreModal";
var columnsT = "";
function StoreDetail() {
  const [modalHeader, setModalHeader] = useState("");
  const [editModeldata, setEditModeldata] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isDeleteModel, setIsDeleteModel] = useState("");
  const [isConfirmDeleteModel, setIsConfirmDeleteModel] = useState("");
  const [isEditModalData, setIsEditModalData] = useState("");
  const [isChangeManagerModal, setIsChangeManagerModal] = useState("");
  const [isFetching, setisFetching] = useState(false);
  const [idforedit, setIdForEdit] = useState("");
  const [type, setType] = useState("");
  const [typeName, setTypeName] = useState("");
  const [position, setPosition] = useState("");
  const [positionName, setPositionName] = useState("");
  const [employee, setEmployee] = useState("");
  const [employeePromote, setEmployeePromote] = useState("");
  const [employeeName, setEmployeeName] = useState("");

  const [button, setButton] = useState(false);
  const [pending, setPending] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [employeeListWithStatus, setemployeeListWithStatus] = useState("2");

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const data = useSelector(
    (state) => state.branchs?.currentBranchSelect?.curBranch?.storeResponseModel
  );
  const typeList = useSelector((state) => state.employees?.employeeType?.type);
  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  );
  const promotelist = useSelector(
    (state) => state.employees?.promoteList?.list
  );
  const employeeListToAdd = useSelector(
    (state) => state.employees?.listToAddToStore?.listAdd
  );

  const isGetBranch = useSelector(
    (state) => state.branchs?.currentBranchSelect?.isFetching
  );

  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  const { id } = useParams("id");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getListEmployeeForPromte(
        user?.data?.token?.accessToken,
        dispatch,
        axiosJWT
      );
      getEmployeeType(dispatch, user?.data?.token?.accessToken, axiosJWT);
      getEmployeePosition(dispatch, user?.data?.token?.accessToken, axiosJWT);
      fetchEmployees("", 1, 2,perPage);
      getAsyns();
    }
  }, [reducerValue]);
  const getAsyns = async () => {
    setPending(true);
    await getCurBranchSelect(
      id,
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
    await getWorkSchedule(
      id,
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
    await getListEmployeeForAdd(
      id,
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
    setPending(false);
  };
  const changeType = (e) => {
    const typeObj = typeList?.find((x) => x.id == e.target.value);
    setType(typeObj?.id);
  };
  const changePosition = (e) => {
    const positionObj = positionList?.find((x) => x.id == e.target.value);
    setPosition(positionObj?.id);
  };
  const changeEmployee = (e) => {
    const employeeObj = employeeListToAdd?.find((x) => x.id == e.target.value);
    setEmployee(employeeObj?.id);
  };
  const changePromoteEmployee = (e) => {
    const employeeObj = promotelist?.find((x) => x.id == e.target.value);
    setEmployeePromote(employeeObj?.id);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    const newEmployee = {
      positionId: position,
      typeId: type,
    };
    try {
      const res = await axiosJWT.put(
        "/api/employeeinstore/hr-update-employee-in-store/" + idforedit,
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setIsEditModalData(false);
        setEditModeldata("");
        toast.success("Edit Employee Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleEditClick = (id, e) => {
    e.preventDefault();
    const employeeObj = employees?.find((x) => x.id == id);
    setEditModeldata(employeeObj);
    setType(employeeObj?.typeId);
    setPosition(employeeObj?.positionId);
    setEmployee(employeeObj?.employeeId);
    setTypeName(employeeObj?.typeName);
    setPositionName(employeeObj?.positionName);
    setEmployeeName(employeeObj?.employeeName);
    setIdForEdit(employeeObj?.id);
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    const newEmployee = {
      employeeId: employee,
      storeId: data?.id,
      positionId: position,
      typeId: type,
    };
    try {
      const res = await axiosJWT.post(
        "api/employeeinstore/hr-assign-new-employee-to-store",
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setIsEditModalData(false);
        setEditModeldata("");
        toast.success("Assign Employee Success");
        foreUpdate();
      }
      if (res.data.code === 400) {
        toast.error(res.data.message);
      }
    } catch (err) {
      if (!err?.response?.data?.errors) {
        toast.error(
          "Server Error Occured When Assign Employee, Try Again Later"
        );
        return;
      }
      if (err?.response?.data?.errors?.Phone) {
        toast.error("" + err.response.data.errors?.Phone);
      }
      if (err?.response?.data?.errors["CitizenIdentificationCardRequest.Sex"]) {
        toast.error(
          "" +
            err?.response?.data?.errors["CitizenIdentificationCardRequest.Sex"]
        );
      }
      if (
        err?.response?.data?.errors[
          "CitizenIdentificationCardRequest.CitizenId"
        ]
      ) {
        toast.error(
          "" +
            err?.response?.data?.errors[
              "CitizenIdentificationCardRequest.CitizenId"
            ]
        );
      }
      if (
        err?.response?.data?.errors[
          "CitizenIdentificationCardRequest.DateOfBirth"
        ]
      ) {
        toast.error(
          "" +
            err?.response?.data?.errors[
              "CitizenIdentificationCardRequest.DateOfBirth"
            ]
        );
      }
      if (
        err?.response?.data?.errors[
          "CitizenIdentificationCardRequest.DateOfIssue"
        ]
      ) {
        toast.error("Invalid Date Of Isssue");
      }
    }
  };

  const handleDelete = async (idDelete) => {
    const newStatus = {
      employeeInStoreId: idDelete,
      storeId: id,
      isForce: false,
    };
    try {
      const res = await axiosJWT.put(
        `/api/employeeinstore/hr-remove-employee-in-store`,
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Remove Employee Status Successfully");
        setIsDeleteModel(false);
        foreUpdate();
      }
    } catch (err) {
      if (err?.response?.data?.code == 409) {
        setIsDeleteModel(false);
        setIsConfirmDeleteModel(true);
      }
    }
  };
  const handleManagerClick = async (e) => {
    e.preventDefault();
    const employeeId = {
      employeeId: employeePromote,
      storeId: id,
    };
    try {
      const res = await axiosJWT.put(
        "/api/employeeinstore/hr-change-store-manager",
        employeeId,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Update Store Manager Successfully");
        setIsChangeManagerModal(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };

  columnsT = [
    {
      name: "Code",
      minWidth: "150px",
      selector: (row) => row.employeeCode,
      sortable: true,
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
      cell: (row) =>
        row.status === 2 ? (
          <span className="badge bg-success">Working</span>
        ) : row.status === 1 ? (
          <span className="badge bg-warning">Pending</span>
        ) : row.status === 0 ? (
          <span className="badge bg-success">New</span>
        ) : (
          <span className="badge bg-danger">Not Working</span>
        ),
    },
    {
      name: (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {user?.data?.account.roleId !== 3 && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setIsModal(true);
                setModalHeader("Add New Employee To Store");
                setIsEditModalData(false);
                setEditModeldata("");
              }}
            >
              <i className="icofont-plus text-success"></i>
            </button>
          )}
        </div>
      ),
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            className="btn btn-outline-secondary"
            hidden={row.status === -1 || row.positionName === "Store Manager"}
            onClick={(e) => {
              handleEditClick(row.id, e);
              setIsEditModalData(true);
              setModalHeader("Edit Employee");
              setIsModal(true);
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          {user?.data?.account.roleId !== 3 && (
            <button
              className="btn btn-outline-secondary"
              data-bs-target="#depedit"
              hidden={row.status === -1 || row.positionName === "Store Manager"}
              onClick={() => {
                setIdForEdit(row.id);
                setIsDeleteModel(true);
              }}
            >
              <i className="icofont-ui-delete text-danger"></i>
            </button>
          )}
        </div>
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
    setemployeeListWithStatus("");
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
    setLoading(true);
    setPerPage(newPerPage);
    fetchEmployees(search, 1, employeeListWithStatus,newPerPage);
    setLoading(false);
  };
  const fetchEmployees = async (search, page, status,perpage) => {
    setLoading(true);

    try {
      if (search) {
        const response = await axiosJWT.get(
          `/api/employeeinstore/manager-get-employees-in-store?StoreId=${id}&EmployeeName=${search}&Page=${
            page ? page : 1
          }&Size=${perpage}&delay=1&${status != null ? `&Status=${status}` : ""}`,
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
                role={user?.data?.account.roleId}
                onClickManager={() => setIsChangeManagerModal(true)}
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
                            eventKey="Pending"
                            onClick={handlePendingClick}
                          >
                            Pending
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="New" onClick={handleNewClick}>
                            New
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
                      progressComponent={<GrowingSpinner />}
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

            {/* <div className="col-xl-4 col-lg-12 col-md-12">
                      <ClientTaskCard />
                        </div> */}
            <div className="col-xl-4 col-lg-12 col-md-12">
              <CurrentStoreWorkSchedule id={id} fore={foreUpdate} />
              {/* <ExperienceCards /> */}
            </div>
          </div>
          <Modal
            centered
            show={isModal}
            onHide={() => {
              setButton(true);
              setIsModal(false);
              setEditModeldata("");
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{modalHeader}</Modal.Title>
            </Modal.Header>
            {isFetching && <GrowingSpinner></GrowingSpinner>}
            {!isFetching && (
              <Modal.Body>
                <form
                  data-parsley-validate=""
                  onSubmit={isEditModalData ? handleEdit : handleCreate}
                >
                  <div className="mb-3">
                    <label htmlFor="depone" className="form-label">
                      Employee
                    </label>
                    <select
                      className="form-select"
                      value={editModeldata ? employee : null}
                      onChange={changeEmployee}
                      required
                    >
                      {editModeldata ? (
                        <option key={employee} value={employee}>
                          {employeeName}
                        </option>
                      ) : (
                        <option></option>
                      )}
                      {employeeListToAdd
                        ? employeeListToAdd.map((pro) => (
                            <option key={pro.id} value={pro.id}>
                              {pro.name}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div className="deadline-form">
                    <div className="row g-3 mb-3">
                      <div className="col-sm-6">
                        <label htmlFor="depone" className="form-label">
                          Type
                        </label>
                        <select
                          className="form-select"
                          value={editModeldata ? type : null}
                          onChange={changeType}
                          required
                        >
                          <option></option>
                          {typeList
                            ? typeList
                                .filter((item) => item.active)
                                .map((pro) => (
                                  <option key={pro.id} value={pro.id}>
                                    {pro.name}
                                  </option>
                                ))
                            : null}
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="deptwo" className="form-label">
                          Position
                        </label>
                        <select
                          className="form-select"
                          value={editModeldata ? position : null}
                          onChange={changePosition}
                          required
                        >
                          <option></option>

                          {positionList
                            ? positionList
                                ?.filter((item) => item.name !== "Store Manager" && item.active)
                                .map((pro) => (
                                  <option key={pro.id} value={pro.id}>
                                    {pro.name}
                                  </option>
                                ))
                            : null}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex flex-row-reverse">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </Modal.Body>
            )}
          </Modal>

          <Modal
            centered
            show={isChangeManagerModal}
            onHide={() => {
              setButton(true);
              setIsChangeManagerModal(false);
              setEditModeldata("");
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Change Manager</Modal.Title>
            </Modal.Header>
            {isFetching && <GrowingSpinner></GrowingSpinner>}
            {!isFetching && (
              <Modal.Body>
                <form data-parsley-validate="" onSubmit={handleManagerClick}>
                  <div className="mb-3">
                    <label htmlFor="depone" className="form-label"></label>
                    <select
                      className="form-select"
                      value={editModeldata ? employeePromote : null}
                      onChange={changePromoteEmployee}
                      required
                    >
                      {editModeldata ? (
                        <option key={employee} value={employee}>
                          {employeeName}
                        </option>
                      ) : (
                        <option></option>
                      )}
                      {promotelist
                        ? promotelist.map((pro) => (
                            <option key={pro.id} value={pro.id}>
                              {pro.name}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                  <div className="d-flex flex-row-reverse">
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </Modal.Body>
            )}
          </Modal>

          <Modal
            show={isDeleteModel}
            centered
            onHide={() => {
              setIsDeleteModel(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                Are you sure to delete this employee from the store?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsDeleteModel(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger color-fff"
                onClick={() => {
                  handleDelete(idforedit);
                }}
              >
                Change
              </button>
            </Modal.Footer>
          </Modal>

          <DeleteEmployeeInStoreModal
            show={isConfirmDeleteModel}
            onHide={() => {
              setIsConfirmDeleteModel(false);
            }}
            setIsConfirmDeleteModel={setIsConfirmDeleteModel}
            employeeInStoreId={idforedit}
            storeId={id}
            fore={foreUpdate}
          ></DeleteEmployeeInStoreModal>
        </div>
      )}
    </div>
  );
}

export default StoreDetail;
