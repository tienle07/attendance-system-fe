import React, { useState, useEffect, useMemo } from "react";
import { Modal, Nav, Spinner, Tab } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { createAxios } from "../../createInstance";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/auth/authSlice";
import moment from "moment";
import { toast } from "react-toastify";
import { useReducer } from "react";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
var columns = "";
function CalendarList() {
const storeid = localStorage.getItem("storeid");
  const employeeList = useSelector(
    (state) => state.employees?.employees?.allEmployees?.data
  );
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  const [data, setData] = useState(employeeList);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
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
      fetchCalendar("", 1);
    }
  }, [reducerValue]);
  const fetchCalendar = async (search, page) => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        `/api/workschedule/manager-get-schedules-in-store?StoreId=${storeid}&Name=${search}&Page=${
          page ? page : 1
        }&Size=10&delay=1`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setData(response.data.data);
      setTotalRows(response.data.metaData.total);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchCalendar(search, page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    setLoading(false);
  };
  const handleNewScheduleClick = async() => {
    const store = {
        storeId : storeid
    } 
    try {
        const res = await axiosJWT.post(
            "api/workschedule/manager-create-new-schedule/"+storeid,store,
            {
                headers: {
                    Authorization: `Bearer ${user?.data?.token?.accessToken}`,
                },
            }
        );

        if (res.data.code >= 200 && res.data.code < 300) {
            toast.success("Create Schedule For Next Week Success");
            foreUpdate();
        }

    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}
  columns = [
    {
      name: "Week Number",
      selector: (row) => row.weekNumber,
    },
    {
      name: "Start Date",
      selector: (row) => moment(row.startDate).format("MMMM Do YYYY"),
      minWidth: "250px",
    },
    {
      name: "End Date",
      selector: (row) => moment(row.endDate).format("MMMM Do YYYY"),
    },
    {
      name: "STATUS",
      selector: (row) => {},
      cell: (row) =>
        row.status === 2 ? (
          <span className="badge bg-success">Finished</span>
        ) : row.status === 1 ? (
          <span className="badge bg-primary">On-Going</span>
        ) : row.status === 0 ? (
          <span className="badge bg-warning">Pending</span>
        ) : (
          <span className="badge bg-danger">Canceled</span>
        ),
    },
  ];
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Calender"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                className="btn btn-dark btn-set-task w-sm-100 me-2"
                onClick={() => {
                    handleNewScheduleClick()
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>New Schedule
              </button>
            </div>
          );
        }}
      />
      <div className="row align-items-center">
        <div className="col-lg-12 col-md-12 flex-column">
          {isGetAllEmployee && <GrowingSpinner></GrowingSpinner>}
          {!isGetAllEmployee && (
            <div className="container-xxl">
              <div className="row clearfix g-3">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-body">
                      <DataTable
                        title="Employees"
                        columns={columns}
                        data={data ? data : []}
                        progressPending={loading}
                        pointerOnHover
                        pagination
                        paginationServer
                        paginationTotalRows={totalRows}
                        onChangeRowsPerPage={handlePerRowsChange}
                        onChangePage={handlePageChange}
                        selectableRows={false}
                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                        highlightOnHover={true}
                        onRowClicked={(e) => {
                          navigate(process.env.PUBLIC_URL + "/calander/" + e.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* table */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarList;
