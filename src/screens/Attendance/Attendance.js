import React, { useEffect, useReducer, useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import AttendanceImageModal from "./AttendanceModal";

function Attendance() {
  const [isModal, setIsModal] = useState(false);
  const [isEditModalData, setIsEditModalData] = useState("");
  const [isDeleteModel, setIsDeleteModel] = useState(false);
  const [isAttendanceModal, setIsAttendanceModal] = useState(false);

  const [attendances, setAttendances] = useState("");
  const [attendanceId, setAttendanceId] = useState("");
  const [form, setForm] = useState({ name: "", date: "" });

  const [loading, setLoading] = useState(false);
  const storeid = localStorage.getItem("storeid");
  let columnsT = "";
  const user = useSelector((state) => state.auth?.login?.currentUser);

  const [attendanceStatus, setAttendanceStatus] = useState("0");
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      fetchAttendances(1, '',perPage);
    }
  }, [reducerValue]);
  const fetchAttendances = async (page, status,perpage) => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        `api/attendance/get-store-all-attendances/${storeid}?Page=${
          page ? page : 1
        }&Size=${perpage}&delay=1${status === true ? '&ByManager=true' : status === false ? '&ByManager=false' : ''}`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setAttendances(response.data.data);
      setTotalRows(response.data.metaData.total);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handlePageChange = (page) => {
    fetchAttendances(page, attendanceStatus,perPage);
  };
  const handlePerRowsChange = (newPerPage) => {
    setLoading(true);
    setPerPage(newPerPage);
    fetchAttendances(1, attendanceStatus,newPerPage);
    setLoading(false);
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosJWT.post(
        "/api/brandholiday/hr-manager-add-holiday",
        form,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setIsEditModalData("");
        toast.success("Create Holiday Success");
        foreUpdate();
      }
      if (res.data.code === 400) {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosJWT.put(
        "/api/brandholiday/hr-manager-update-holiday-information/" + form?.id,
        form,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setIsEditModalData("");
        toast.success("Edit Holidays Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDelete = async () => {
    try {
      const res = await axiosJWT.put(
        "/api/brandholiday/hr-manager-update-holiday-status/" + form?.id,
        form,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Delete Employee Successfully");
        setIsDeleteModel(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  columnsT = [
    {
      name: "Employee",
      selector: (row) => <span>{row.employeeName}</span>,
      minWidth: "200px",
    },
    {
      name: "Check In",
      selector: (row) => (
        <span>{moment(row.checkIn).format("h:mm A, DD-MM-YYYY")}</span>
      ),
    },
    {
      name: "Check Out",
      selector: (row) => (
        <span>{ row.checkOut ? moment(row.checkOut).format("h:mm A, DD-MM-YYYY") : 'Not Check'}</span>
      ),
    },
    {
      name: "Check By",
      selector: (row) =>
        row.byManager ? <span>Manager</span> : <span>Machine</span>,
      sortable: true,
    },
    {
      name: "Mode",
      selector: (row) => {},
      cell: (row) =>
        row.mode === 1 ? (
          <span className="badge bg-warning">Checked In </span>
        ) : row.mode === 2 ? (
          <span className="badge bg-success">Checked Out </span>
        ) : (
          <span className="badge bg-danger">Not Check</span>
        ),
    },
  ];
  const handleAllClick = () => {
    setAttendanceStatus('');
    fetchAttendances(1, null,perPage);
  };
  const handleMachineClick = () => {
    setAttendanceStatus(false);
    fetchAttendances(1, false,perPage);
  };
  const handleManagerClick = () => {
    setAttendanceStatus(true);
    fetchAttendances(1, true,perPage);
  };
  return (
    <div className="container-xxl">
      <Tab.Container defaultActiveKey="All">
        <PageHeader
          headerTitle="Attendance"
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                {/* <button
                  className="btn btn-dark btn-set-task w-sm-100 me-2"
                  onClick={() => {
                    setIsModal(true);
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Holidays
                </button> */}
                <Nav
                  variant="pills"
                  className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="All" onClick={handleAllClick}>
                      All
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="CheckByMachine"
                      onClick={handleMachineClick}
                    >
                      Check By Machine
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="CheckByManager" onClick={handleManagerClick}>
                    Check By Manager
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            );
          }}
        />
        <div className="row clearfix g-3">
          <div className="card">
            <div className="card-body">
              <DataTable
                title="Attendances"
                columns={columnsT}
                data={attendances ? attendances : []}
                defaultSortField="title"
                progressPending={loading}
                paginationServer
                pagination
                paginationTotalRows={totalRows}
                paginationRowsPerPageOptions={[5, 10, 25, 50]}
                onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                selectableRows={false}
                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                highlightOnHover={true}
                onRowClicked={(e) => {
                  setAttendanceId(e.id);
                  setIsAttendanceModal(true);
                }}
              />
            </div>
          </div>
        </div>
      </Tab.Container>

      <Modal
        centered
        show={isModal}
        onHide={() => {
          setIsModal(false);
          setIsEditModalData("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {isEditModalData ? "Edit" : "Add"} Holiday
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            id="holidayform"
            onSubmit={isEditModalData ? handleEdit : handleCreate}
          >
            <div className="row g-3 mb-3">
              <div className="col-lg-8">
                <label className="form-label">Holiday Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  id="exampleFormControlInput1"
                  value={isEditModalData ? form.name : null}
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-4">
                <label className="form-label">Coefficient Salary</label>
                <input
                  type="text"
                  name="coefficientSalary"
                  className="form-control"
                  id="exampleFormControlInput1"
                  value={isEditModalData ? form.coefficientSalary : null}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Holiday Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                onChange={handleChange}
                id="exampleFormControlInput2778"
                value={
                  isEditModalData
                    ? moment(form.date).format("YYYY-MM-DD")
                    : null
                }
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsModal(false);
            }}
          >
            Done
          </button>
          <button type="submit" form="holidayform" className="btn btn-primary">
            Sent
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isDeleteModel}
        centered
        onHide={() => {
          setIsDeleteModel(false);
          setForm({});
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Holiday</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            Are you sure to delete this holiday?
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
              handleDelete();
            }}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
      <AttendanceImageModal
        show={isAttendanceModal}
        onHide={() => {
          setIsAttendanceModal(false);
        }}
        id={attendanceId}
        isImageModal={isAttendanceModal}
      ></AttendanceImageModal>
    </div>
  );
}

export default Attendance;
