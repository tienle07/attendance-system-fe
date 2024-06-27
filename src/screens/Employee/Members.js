import React, { useState, useEffect, useMemo } from "react";
import { Modal, Nav, Spinner, Tab } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { createAxios } from "../../createInstance";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/auth/authSlice";
import moment from "moment";

import {
  getAllEmployeeBySearchName,
  getCurEmployeeSelect,
} from "../../redux/employee/employeeApi";
import { imageDb } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import { useReducer } from "react";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import AddressModal from "./addressModal";
import {
  getDistrict,
  getProvince,
  getWard,
} from "../../redux/address/addressApi";
var columns = "";
function Members() {
  const isLoading = useSelector(
    (state) => state.employees?.currentSelectEmployee?.isFetching
  );
  // const employeeList = data.filter(
  //   item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
  // );
  const employeeList = useSelector(
    (state) => state.employees?.employees?.allEmployees?.data
  );
  const totalrow = useSelector(
    (state) => state.employees?.employees?.allEmployees?.metaData?.total
  );

  const [isModal, setIsModal] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [isDeleteModel, setIsDeleteModel] = useState(false);
  const [isEditModelData, setIsEditModalData] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [isPlaceOfOriginModal, setisPlaceOfOriginModal] = useState(false);
  const [isCurrentAddressModel, setisCurrentAddressModel] = useState(false);
  const [isPlaceOfResidentModel, setisPlaceOfResidentModel] = useState(false);

  const [button, setButton] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [editModeldata, setEditModeldata] = useState("");
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  const [data, setData] = useState(employeeList);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [employeeListWithStatus, setemployeeListWithStatus] =
    useState("active");
  const [page, setPage] =
    useState(1);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setemail] = useState("");
  const [currentAddress, setcurrentAddress] = useState("");
  const [profileImage, setprofileImage] = useState("");
  const [citizenId, setcitizenId] = useState("");
  const [dateOfBirth, setdateOfBirth] = useState("");
  const [sex, setsex] = useState("");
  const [nationality, setnationality] = useState("");
  const [placeOfOrigrin, setplaceOfOrigrin] = useState("");
  const [placeOfResidence, setplaceOfResidence] = useState("");
  const [dateOfIssue, setdateOfIssue] = useState("");
  const [issuedBy, setissuedBy] = useState("");

  const [imageurl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const [progress, setProgress] = useState(0);
  const user = useSelector((state) => state.auth?.login?.currentUser);

  const isGetAllEmployee = useSelector(
    (state) => state.employees?.employees?.isFetching
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      fetchUsers("", page, employeeListWithStatus);
      getProvince(user?.data?.token?.accessToken, dispatch, axiosJWT);
    }
  }, [reducerValue]);
  const fetchUsers = async (search, page, status) => {
    setLoading(true);
    try {
      if (search) {
        const response = await axiosJWT.get(
          `/api/employee/hr-get-employee-list?Name=${search}&Page=${
            page ? page : 1
          }&Size=10&delay=1&${
            status === "active"
              ? `&Active=${true}`
              : status === "inactive"
              ? `&Active=${false}`
              : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        setData(response.data.data);
        setTotalRows(response.data.metaData.total);
      } else {
        const response = await axiosJWT.get(
          `/api/employee/hr-get-employee-list?Page=${
            page ? page : 1
          }&Size=10&delay=1${
            status === "active"
              ? `&Active=${true}`
              : status === "inactive"
              ? `&Active=${false}`
              : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        setData(response.data.data);
        setTotalRows(response.data.metaData.total);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    setPage(page)
    fetchUsers(search, page, employeeListWithStatus);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    // const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${newPerPage}&delay=1`);
    getAllEmployeeBySearchName(
      search,
      page,
      user?.data?.token?.accessToken,
      dispatch
    );
    setLoading(false);
  };
  const handleCreateSend = async (link) => {
    const newEmployee = {
      fullName: name,
      currentAddress: currentAddress,
      phone: phone,
      email: email,
      level: 0,
      profileImage: link ? link : "",
      citizenId: citizenId,
      dateOfBirth: dateOfBirth,
      sex: sex,
      nationality: nationality,
      placeOfOrigrin: placeOfOrigrin,
      placeOfResidence: placeOfResidence,
      dateOfIssue: dateOfIssue,
      issuedBy: issuedBy,
    };
    try {
      const res = await axiosJWT.post(
        "/api/employee/hr-add-new-employee",
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
        toast.success("Create Employee Success");
        foreUpdate();
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error("" + err?.response?.data?.message);
        return;
      }
      Object.keys(err?.response?.data?.errors).map((fieldName) => {
        console.log(err?.response?.data?.errors[fieldName]);
        return toast.error("" + err?.response?.data?.errors[fieldName]);
      });

    }
  };
  const handleEditClick = async (id, e) => {
    setId(id);
    e.preventDefault();
    // getCurEmployeeSelect(id,dispatch,user?.data?.token?.accessToken);
    setIsLoadingModal(true);
    try {
      var res = await axiosJWT.get("/api/employee/get-employee-detail/" + id, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      const data = res.data.data;
      setEditModeldata(res.data.data);
      await setEmployeeDataModel(data?.employeeResponse);
      setIsModal(true);
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
    setIsLoadingModal(false);
  };

  const setEmployeeDataModel = (data) => {
    if (!data) {
      setName("");
      setPhone("");
      setCode("");
      setemail("");
      setprofileImage("");
      setcurrentAddress("");
      setcitizenId("");
      setdateOfBirth("");
      setdateOfIssue("");
      setissuedBy("");
      setnationality("");
      setplaceOfOrigrin("");
      setplaceOfResidence("");
      setsex("");
      return;
    }
    setName(data.name);
    setCode(data.code);
    setPhone(data.phone);
    setemail(data.email);
    setprofileImage(data.profileImage);
    setcurrentAddress(data.currentAddress);
    setcitizenId(data?.citizenId);
    setdateOfBirth(moment(data?.dateOfBirth).format("YYYY-MM-DD"));
    setdateOfIssue(moment(data?.dateOfIssue).format("YYYY-MM-DD"));
    setissuedBy(data?.issuedBy);
    setnationality(data?.nationality);
    setplaceOfOrigrin(data?.placeOfOrigrin);
    setplaceOfResidence(data?.placeOfResidence);
    setsex(data?.sex);
  };

  const handleUpload = async (link) => {
    const newEmployee = {
      code: code,
      currentAddress: currentAddress,
      phone: phone,
      email: email,
      profileImage: link ? link : profileImage,
      level: 0,
      citizenId: citizenId,
      fullName: name,
      dateOfBirth: dateOfBirth,
      sex: sex,
      nationality: nationality,
      placeOfOrigrin: placeOfOrigrin,
      placeOfResidence: placeOfResidence,
      dateOfIssue: dateOfIssue,
      issuedBy: issuedBy,
    };
    try {
      const res = await axiosJWT.put(
        "/api/employee/hr-update-employee-information/" + id,
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
      if (err?.response?.data?.message) {
        toast.error("" + err?.response?.data?.message);
        return;
      }
      Object.keys(err?.response?.data?.errors).map((fieldName) => {
        console.log(err?.response?.data?.errors[fieldName]);
        return toast.error("" + err?.response?.data?.errors[fieldName]);
      });
    }
  };
  const handleEdit = (e) => {
    e.preventDefault();
    if (image) {
      const imgRef = ref(imageDb, `avatar/${image.name}`);
      uploadBytes(imgRef, image).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setUrl(url);
          handleUpload(url);
        });
      });
    } else {
      handleUpload(null);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (image) {
      const imgRef = ref(imageDb, `avatar/${image.name}`);
      uploadBytes(imgRef, image).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setUrl(url);
          handleCreateSend(url);
        });
      });
    } else {
      handleCreateSend(null);
    }
  };
  const handleDelete = async (id) => {
    const employeeId = {
      employeeId: id,
    };
    try {
      const res = await axiosJWT.put(
        "/api/employee/hr-update-employee-status/" + id,
        employeeId,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Change Status Employee Successfully");
        setIsDeleteModel(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  columns = [
    {
      name: "Code",
      selector: (row) => row.code,
      maxWidth: "170px",
      sortable: true,
    },
    {
      name: "EMPLOYEE NAME",
      selector: (row) => row.name,
      sortable: true,
      minWidth: "270px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      maxWidth: "150px",
    },
    {
      name: "STATUS",
      selector: (row) => {},
      maxWidth: "50px",
      cell: (row) =>
        row.active ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        ),
    },
    {
      name: "Action",
      selector: (row) => {},
      maxWidth: "50px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            className="btn btn-outline-secondary"
            onClick={(e) => {
              handleEditClick(row.id, e);
              setIsEditModalData(true);
              setModalHeader("Edit Employee");
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          <button
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            onClick={() => {
              setIsDeleteModel(true);
              setId(row.id);
            }}
          >
            <i className="icofont-exchange text-danger"></i>
          </button>
        </div>
      ),
    },
  ];
  const handleClose = () => {
    getWard(user?.data?.token?.accessToken, dispatch, 0);
    getDistrict(user?.data?.token?.accessToken, dispatch, 0);
  };
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      setSearch(e.target.value);
      fetchUsers(e.target.value, 1, employeeListWithStatus);
    }
  };
  const handleAllClick = () => {
    setemployeeListWithStatus("");
    fetchUsers("", 1, null);
  };
  const handleActiveClick = () => {
    setemployeeListWithStatus("active");
    fetchUsers("", 1, "active");
  };
  const handleNonActiveClick = () => {
    setemployeeListWithStatus("inactive");
    fetchUsers("", 1, "inactive");
  };
  return (
    <div className="container-xxl">
      <Tab.Container defaultActiveKey="Active">
        <PageHeader
          headerTitle="Manage Employees"
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                <button
                  className="btn btn-dark btn-set-task w-sm-100 me-2"
                  onClick={() => {
                    setIsModal(true);
                    setEditModeldata("");
                    setModalHeader("Add New Employee");
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Employee
                </button>
                <Nav
                  variant="pills"
                  className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="Active" onClick={handleActiveClick}>
                      Active
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="nonActive"
                      onClick={handleNonActiveClick}
                    >
                      Inactive
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="All" onClick={handleAllClick}>
                      All
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            );
          }}
        />
        <div className="row align-items-center">
          <div className="col-lg-12 col-md-12 flex-column">
            {isGetAllEmployee && <GrowingSpinner></GrowingSpinner>}
            {!isGetAllEmployee && (
              <Tab.Content>
                <div className="row g-3">
                  <div className=" col-xl-8 col-lg-12 col-md-12"></div>
                  <div className="col-xl-4 col-lg-12 col-md-12">
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
                </div>
                <Tab.Pane eventKey="Active">
                  <div className="container-xxl">
                    <div className="row clearfix g-3">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            <DataTable
                              title="Employees"
                              progressPending={isLoadingModal}
                              paginationServer
                              paginationTotalRows={totalRows}
                              onChangeRowsPerPage={handlePerRowsChange}
                              onChangePage={handlePageChange}
                              columns={columns}
                              data={data ? data : []}
                              defaultSortField="title"
                              persistTableHead
                              noDataComponent="No Employee Correct"
                              pagination
                              selectableRows={false}
                              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                              highlightOnHover={true}
                              onRowClicked={(e) => {
                                getCurEmployeeSelect(
                                  e.id,
                                  dispatch,
                                  user?.data?.token?.accessToken
                                );
                                navigate(
                                  process.env.PUBLIC_URL + "/members/" + e.id
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* table */}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="nonActive">
                  <div className="container-xxl">
                    <div className="row clearfix g-3">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            <DataTable
                              title="Employees"
                              columns={columns}
                              paginationServer
                              paginationTotalRows={totalRows}
                              onChangeRowsPerPage={handlePerRowsChange}
                              onChangePage={handlePageChange}
                              data={data ? data : []}
                              defaultSortField="title"
                              pagination
                              subHeader
                              selectableRows={false}
                              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                              highlightOnHover={true}
                              onRowClicked={(e) => {
                                getCurEmployeeSelect(
                                  e.id,
                                  dispatch,
                                  user?.data?.token?.accessToken
                                );
                                navigate(
                                  process.env.PUBLIC_URL + "/members/" + e.id
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* table */}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="All">
                  <div className="container-xxl">
                    <div className="row clearfix g-3">
                      <div className="col-md-12">
                        <div className="card">
                          <div className="card-body">
                            <DataTable
                              title="Employees"
                              columns={columns}
                              data={data ? data : []}
                              // defaultSortField="title"
                              progressPending={isGetAllEmployee}
                              pagination
                              paginationServer
                              paginationTotalRows={totalRows}
                              onChangeRowsPerPage={handlePerRowsChange}
                              onChangePage={handlePageChange}
                              // paginationComponent={CustomMaterialPagination}
                              subHeader
                              selectableRows={false}
                              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                              highlightOnHover={true}
                              onRowClicked={(e) => {
                                getCurEmployeeSelect(
                                  e.id,
                                  dispatch,
                                  user?.data?.token?.accessToken
                                );
                                navigate(
                                  process.env.PUBLIC_URL + "/members/" + e.id
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* table */}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            )}
          </div>
        </div>
      </Tab.Container>
      <Modal
        centered
        show={isModal}
        size="lg"
        onHide={() => {
          setEmployeeDataModel(null);
          setIsModal(false);
          setIsEditModalData(false);
          setEditModeldata("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{modalHeader}</Modal.Title>
        </Modal.Header>
        {isLoading && <Spinner animation="grow" variant="primary" />}
        {!isLoading && (
          <Modal.Body>
            <form
              id="advanced-form"
              data-parsley-validate=""
              onSubmit={editModeldata ? handleEdit : handleCreate}
            >
              <div className="modal-body">
                {editModeldata && (
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="exampleFormControlInput877"
                        className="form-label"
                      >
                        Employee Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput877"
                        placeholder="Explain what the Employee Name"
                        value={editModeldata ? name : null}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        Employee Code
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput477"
                        readOnly
                        placeholder="Code"
                        value={editModeldata ? code : null}
                        onChange={(e) => setCode(e.target.value)}
                        // required
                      />
                    </div>
                  </div>
                )}
                {!editModeldata && (
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput877"
                      className="form-label"
                    >
                      Employee Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput877"
                      placeholder="Explain what the Employee Name"
                      value={editModeldata ? name : null}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput777"
                      className="form-label"
                    >
                      Citizen ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput977"
                      placeholder="Explain what the Citizen ID"
                      value={editModeldata ? citizenId : null}
                      onChange={(e) => {
                        setcitizenId(e.target.value);
                        e.target.value?.length !== 12
                          ? setIsValid(true)
                          : setIsValid(false);
                      }}
                      required
                      data-parsley-length="12"
                    />
                    {citizenId?.length !== 12 && button ? (
                      <span className="text-danger">
                        Citizen ID is 12 character
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={editModeldata ? sex : null}
                      onChange={(e) => setsex(e.target.value)}
                      required
                    >
                      <option></option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput1778"
                    className="form-label"
                  >
                    Current Address
                  </label>
                  <div
                    className="input-group flex-nowrap"
                    onClick={(e) => {
                      setisCurrentAddressModel(true);
                    }}
                  >
                    <input
                      type="text"
                      readOnly
                      value={currentAddress}
                      className="form-control"
                      placeholder="Click to set address"
                      aria-label="search"
                      aria-describedby="addon-wrapping"
                      required
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      id="addon-wrapping"
                    >
                      <i className="icofont-ui-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="formFileMultipleoneone"
                    className="form-label"
                  >
                    Employee Profile Image
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    id="formFileMultipleoneone"
                    onChange={onChangeImage}
                  />
                </div>
                <div className="deadline-form">
                  <div className="row g-3 mb-3">
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleFormControlInput477"
                        placeholder="Email"
                        value={editModeldata ? email : null}
                        onChange={(e) => setemail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput777"
                        className="form-label"
                      >
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput777"
                        placeholder="Phone"
                        value={editModeldata ? phone : null}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        data-parsley-length="[7,13]"
                      />
                      {!phone?.startsWith("0") && button ? (
                        <span className="text-danger">
                          Not Valid Phone Number
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        Date of birth
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="exampleFormControlInput477"
                        placeholder="Date of birth"
                        value={editModeldata ? dateOfBirth : null}
                        onChange={(e) => setdateOfBirth(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        National
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput477"
                        value={editModeldata ? nationality : null}
                        onChange={(e) => setnationality(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput777"
                      className="form-label"
                    >
                      Place Of Origin
                    </label>
                    <div
                      className="input-group flex-nowrap"
                      onClick={(e) => setisPlaceOfOriginModal(true)}
                    >
                      <input
                        type="text"
                        readOnly
                        value={placeOfOrigrin}
                        className="form-control"
                        placeholder="Click to set address"
                        aria-label="search"
                        aria-describedby="addon-wrapping"
                      />
                      <button
                        type="button"
                        className="input-group-text"
                        id="addon-wrapping"
                      >
                        <i className="icofont-ui-edit"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput777"
                      className="form-label"
                    >
                      Place Of Residence
                    </label>
                    <div
                      className="input-group flex-nowrap"
                      onClick={(e) => setisPlaceOfResidentModel(true)}
                    >
                      <input
                        type="text"
                        readOnly
                        value={placeOfResidence}
                        className="form-control"
                        placeholder="Click to set address"
                        aria-label="search"
                        aria-describedby="addon-wrapping"
                      />
                      <button
                        type="button"
                        className="input-group-text"
                        id="addon-wrapping"
                      >
                        <i className="icofont-ui-edit"></i>
                      </button>
                    </div>
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        Date of Issue
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="exampleFormControlInput477"
                        value={editModeldata ? dateOfIssue : null}
                        onChange={(e) => setdateOfIssue(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        Issue By
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput477"
                        placeholder="National"
                        value={editModeldata ? issuedBy : null}
                        onChange={(e) => setissuedBy(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Modal.Body>
        )}
        <Modal.Footer>
          <button
            type="submit"
            form="advanced-form"
            className="btn btn-primary"
            onClick={() => {
              setButton(true);
            }}
          >
            Submit
          </button>
        </Modal.Footer>
      </Modal>

      <AddressModal
        show={isCurrentAddressModel}
        // onClose={()=>{setisCurrentAddressModel(false)}}
        onClose={() => {
          setisCurrentAddressModel(false);
          handleClose();
        }}
        editModeldata={currentAddress}
        setaddressReturn={setcurrentAddress}
        loading={setIsLoadingModal}
      ></AddressModal>
      <AddressModal
        show={isPlaceOfOriginModal}
        // onClose={()=>{setisPlaceOfOriginModal(false);}}
        onClose={() => {
          setisPlaceOfOriginModal(false);
          handleClose();
        }}
        editModeldata={placeOfOrigrin}
        setaddressReturn={setplaceOfOrigrin}
        loading={setIsLoadingModal}
      ></AddressModal>
      <AddressModal
        show={isPlaceOfResidentModel}
        // onClose={()=>{setisPlaceOfResidentModel(false);}}
        onClose={() => {
          setisPlaceOfResidentModel(false);
          handleClose();
        }}
        editModeldata={placeOfResidence}
        setaddressReturn={setplaceOfResidence}
        loading={setIsLoadingModal}
      ></AddressModal>
      <Modal
        show={isDeleteModel}
        centered
        onHide={() => {
          setIsDeleteModel(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Change Status Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            Are you sure to change status this employee?
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
              handleDelete(id);
            }}
          >
            Confirm
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Members;
