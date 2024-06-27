import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Nav, Tab } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { TicketsViewData } from "../../components/Data/AppData";
import { useEffect } from "react";
import { getSelectedApplicationDetails } from "../../redux/ticket/ticketApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";
import { getAllAccount } from "../../redux/account/accountApi";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";

function Accounts() {
  const storeId = localStorage.getItem("storeid");
  const [isModal, setIsModal] = useState(false);
  const [siEditModal, setSiEditModal] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState("");
  const [accountStatus, setAccountStatus] = useState(true);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const allAccount = useSelector(
    (state) => state.accounts?.accounts?.allAccounts
  );

  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  var columnT = "";

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      fetchAccounts(page,search, accountStatus,perPage);
    }
  }, [reducerValue]);
  const fetchAccounts = async (page,search, status,perpage) => {
    setLoading(true);
    try {
      const response = await axiosJWT.get(
        `api/account?Page=${page ? page : 1}&Size=${perpage}&delay=1${
          status === true
            ? "&active=true"
            : status === false
            ? "&active=false"
            : ""
        }${
          search 
            ? `&Username=${search}`
            : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setAccounts(response.data.data);
      setTotalRows(response.data.metaData.total);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  const handlePageChange = (page) => {
    setPage(page);
    fetchAccounts(page,search, accountStatus,perPage);
  };
  const handlePerRowsChange = (newPerPage) => {
    setLoading(true);
    setPerPage(newPerPage);
    fetchAccounts(1,search, accountStatus,newPerPage);
    setLoading(false);
  };
  const handleActiveAccount = async (id, active) => {
    try {
      const res = await axiosJWT.put(
        "/api/account/update-account-status/" + id,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success(`${active ? "Deactive" : "Active"} Account Success`);
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  columnT = [
    {
      name: "Account",
      selector: (row) => row.username,
    },
    {
      name: "Role",
      selector: (row) => row.roleName,
    },
    {
      name: "Brand",
      selector: (row) => row.brandName,
    },
    {
      name: "Status",
      selector: (row) => {},
      cell: (row) =>
        row.active ? (
          <span className="badge bg-success">Active</span>
        ) : (
          <span className="badge bg-danger">Inactive</span>
        ),
    },
    {
      name: "Action",
      maxWidth: "50px",
      selector: (row) => {},
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              handleActiveAccount(row.id, row.active);
            }}
          >
            <i className="icofont-exchange text-danger"></i>
          </button>
        </div>
      ),
    },
  ];
  const handleAllClick = () => {
    setAccountStatus("");
    setSearch('')
    fetchAccounts(1,'', null,perPage);
  };
  const handleActiveClick = () => {
    setAccountStatus(true);
    setPage(1);
    setSearch('')
    fetchAccounts(1,'', true,perPage);
  };
  const handleDeactiveClick = () => {
    setPage(1);
    setAccountStatus(false);
    setSearch('')
    fetchAccounts(1,'', false,perPage);
  };
  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      setPage(1);
      setSearch(e.target.value);
      fetchAccounts(1, e.target.value, accountStatus,perPage);
    }
  };
  return (
    <div className="container-xxl">
      <Tab.Container defaultActiveKey="Active">
        <PageHeader
          headerTitle="Accounts"
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                <div className="input-group flex-nowrap input-group-sm  me-2">
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
                    onKeyDown={handleSearch}
                    placeholder="Search"
                    aria-label="search"
                    aria-describedby="addon-wrapping"
                  />
                </div>
                <Nav
                  variant="pills"
                  className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100"
                  style={{minWidth: 208}}
                >
                  <Nav.Item>
                    <Nav.Link eventKey="Active" onClick={handleActiveClick}>
                      Active
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="Deactive" onClick={handleDeactiveClick}>
                      Deactive
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
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <DataTable
                  title={TicketsViewData.title}
                  columns={columnT}
                  data={accounts ? accounts : []}
                  defaultSortField="title"
                  progressPending={loading}
                  paginationServer
                  pagination
                  paginationTotalRows={totalRows}
                  paginationRowsPerPageOptions={[5, 10, 25, 50]}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  // onRowClicked={(e) => {
                  //     getSelectedApplicationDetails(e.id, user?.data?.token?.accessToken, dispatch)
                  //     navigate(
                  //         process.env.PUBLIC_URL + "/application/" + e.id
                  //     );
                  // }}
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              </div>
            </div>
          </div>
        </div>
      </Tab.Container>
    </div>
  );
}

export default Accounts;
