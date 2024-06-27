import React, { useEffect, useReducer, useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../components/common/PageHeader";
import { HolidaysData } from "../../components/Data/AppData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function Holidays() {
  const [isModal, setIsModal] = useState(false);
  const [isEditModalData, setIsEditModalData] = useState("");
  const [isDeleteModel, setIsDeleteModel] = useState(false);

  const [holidays, setHolidays] = useState("");
  const [form, setForm] = useState({ name: "", date: "" });

  const [loading, setLoading] = useState(false);

  let columnsT = "";
  const user = useSelector((state) => state.auth?.login?.currentUser);

  const [holidayStatus, setholidayStatus] = useState("0");
  const [totalRows, setTotalRows] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      fetchHolidays(1, "0");
    }
  }, [reducerValue]);
  const fetchHolidays = async (page, status) => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        `/api/brandholiday?Page=${page ? page : 1}&Size=10&delay=1&${
          status || status === 0 ? `&Status=${status}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setHolidays(response.data.data);
      setTotalRows(response.data.metaData.total);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handlePageChange = (page) => {
    fetchHolidays(page, holidayStatus);
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
    } catch (err) {
      if (err?.response?.data?.message) {
        toast.error("" + err?.response?.data?.message);
        return;
      }
      Object.keys(err?.response?.data?.errors).map((fieldName) => {
        console.log(err?.response?.data?.errors[fieldName]);
        return toast.error("" + err?.response?.data?.errors[fieldName]);
      });
      if (!err?.response?.message) {
        toast.error(err?.response?.data?.message);
        return;
      }
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
      Object.keys(err?.response?.data?.errors).map((fieldName) => {
        console.log(err?.response?.data?.errors[fieldName]);
        return toast.error("" + err?.response?.data?.errors[fieldName]);
      });
      if (!err?.response?.message) {
        toast.error(err?.response?.data?.message);
        return;
      }
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDelete = async () => {
    try {
      const res = await axiosJWT.put(
        "/api/brandholiday/hr-manager-update-holiday-status/" + form.id,
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
      name: "Holiday Name",
      selector: (row) => <span>{row.name}</span>,
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Holiday Date",
      selector: (row) => <span>{moment(row.date).format("MMMM Do YYYY")}</span>,
      sortable: true,
    },
    {
      name: "Coefficient Salary",
      selector: (row) => (
        <div style={{ textAlign: "center" }}>{row.coefficientSalary}</div>
      ),
      // selector: (row) => <span>X{row.coefficientSalary}</span>,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {},
      cell: (row) =>
        row.status === 1 ? (
          <span className="badge bg-success">Finished </span>
        ) : row.status === 0 ? (
          <span className="badge bg-warning">Future </span>
        ) : (
          <span className="badge bg-danger">Canceled</span>
        ),
      sortable: true,
    },
    {
      name: "Action",
      selector: () => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => {
              setIsModal(true);
              setIsEditModalData(row);
              setForm(row);
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary deleterow"
            onClick={() => {
              setIsDeleteModel(true);
              // setIsEditModalData(row);
              setForm(row);
            }}
          >
            <i className="icofont-ui-delete text-danger"></i>
          </button>
        </div>
      ),
    },
  ];
  const handleAllClick = () => {
    setholidayStatus("");
    fetchHolidays(1, null);
  };
  const handleActiveClick = () => {
    setholidayStatus("0");
    fetchHolidays(1, "0");
  };
  const handleNonActiveClick = () => {
    setholidayStatus("-1");
    fetchHolidays(1, "-1");
  };
  const handleFinishClick = () => {
    setholidayStatus("1");
    fetchHolidays(1, "1");
  };
  return (
    <div className="container-xxl">
      <Tab.Container defaultActiveKey="Active">
        <PageHeader
          headerTitle="Holidays"
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                <button
                  className="btn btn-dark btn-set-task w-sm-100 me-2"
                  onClick={() => {
                    setIsModal(true);
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Holidays
                </button>
                <Nav
                  variant="pills"
                  className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="Active" onClick={handleActiveClick}>
                      Future
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="nonActive"
                      onClick={handleNonActiveClick}
                    >
                      Canceled
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="finish" onClick={handleFinishClick}>
                      Finished
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
        <div className="row clearfix g-3">
          <div className="card">
            <div className="card-body">
              <DataTable
                title={HolidaysData.title}
                columns={columnsT}
                data={holidays ? holidays : []}
                defaultSortField="title"
                progressPending={loading}
                paginationServer
                paginationTotalRows={totalRows}
                // onChangeRowsPerPage={handlePerRowsChange}
                onChangePage={handlePageChange}
                selectableRows={false}
                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                highlightOnHover={true}
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
    </div>
  );
}

export default Holidays;
