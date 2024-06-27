import React, { useReducer, useState } from "react";
import DataTable from "react-data-table-component";
import ClientProfileCard from "../../components/Clients/ClientProfileCard";
import PageHeader from "../../components/common/PageHeader";
import { ClientInvoicesData } from "../../components/Data/DashboardData";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { getCurEmployeeSelect } from "../../redux/employee/employeeApi";
import { GenerateAccountForEmployee } from "../../redux/auth/authApi";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../../firebase";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import moment from "moment";
import EditMemberModals from "./EditMemberModals";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { Dropdown, Spinner } from "react-bootstrap";

let columnsT = [];
function MemberProfile() {
  const { id } = useParams("id");

  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const data = useSelector(
    (state) => state.employees?.currentSelectEmployee?.curEmployee
  );
  const isGetCurEmployee = useSelector(
    (state) => state.employees?.currentSelectEmployee?.isFetching
  );
  const [form, setForm] = useState([]);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [button, setButton] = useState(false);
  const [image, setImage] = useState(null);
  const [imgurl, setImgUrl] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getCurEmployeeSelect(
        id,
        dispatch,
        user?.data?.token?.accessToken,
        axiosJWT
      );
    }
  }, [reducerValue, id]);
  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      setForm(data?.employeeResponse);
      setImgUrl(data?.employeeResponse?.profileImage);
    }
  }, [data?.employeeResponse.id]);
  const handleGenerateAccount = async (d) => {
    const emp = {
      employeeId: d,
    };
    await GenerateAccountForEmployee(
      d,
      emp,
      dispatch,
      user?.data?.token?.accessToken
    );
    foreUpdate();
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleEdit = (e) => {
    e.preventDefault();
    if (image) {
      const imgRef = ref(imageDb, `avatar/${image.name}`);
      uploadBytes(imgRef, image).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setForm({ ...form, logoUrl: url });
          handleUpload(url);
        });
      });
    } else {
      handleUpload();
    }
  };
  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = async (link) => {
    const newEmployee = {
      currentAddress: form?.currentAddress,
      phone: form?.phone,
      email: form?.email,
      profileImage: link ? link : imgurl,
      level: 0,
      citizenId: form?.citizenId,
      fullName: form?.name,
      dateOfBirth: form?.dateOfBirth,
      sex: form?.sex,
      nationality: form?.nationality,
      placeOfOrigrin: form?.placeOfOrigrin,
      placeOfResidence: form?.placeOfResidence,
      dateOfIssue: form?.dateOfIssue,
      issuedBy: form?.issuedBy,
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
        setIsEditModal(false);
        toast.success("Edit Profile Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleSendAccount = async (id) => {
    setIsSending(true);
    try {
      const res = await axiosJWT.post("/api/account/send-account/" + id, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Send Account For Employee Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
    setIsSending(false);
  };
  const handleActiveAccount = async (id) => {
    try {
      const res = await axiosJWT.put("/api/account/update-account-status/" + id, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success(`${data?.accountResponseModel?.active ? "Deactive" : "Active"} Account Success`);
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  columnsT = [
    {
      name: "Store Name",
      selector: (row) => row.storeName,
    },
    {
      name: "Assign  Date",
      selector: (row) => moment(row.assignedDate).format("DD-MM-YYYY"),
    },
    {
      name: "Type",
      selector: (row) => row.typeName,
    },
    {
      name: "Position",
      selector: (row) => row.positionName,
    },
    {
      name: "STATUS",
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
  ];
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Employee Profile"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                hidden={localStorage.getItem("role") !== "2"}
                className="btn btn-dark btn-set-task w-sm-100 me-2"
                onClick={() => {
                  setIsEditModal(true);
                }}
              >
                <i className="icofont-edit me-2 fs-6"></i>Edit Profile
              </button>
              <Dropdown
                hidden={localStorage.getItem("role") !== "2"}
                className="btn-group"
              >
                <Dropdown.Toggle
                  as="button"
                  className="btn dropdown-toggle btn-dark btn-set-task w-sm-100 me-2"
                >
                  <i className="icofont-key-hole  fs-6"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <li>
                    <button
                      hidden={data?.accountResponseModel}
                      className="dropdown-item"
                      onClick={() => {
                        handleGenerateAccount(id);
                      }}
                    >
                      Generate
                      Account
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      disabled={isSending}
                      hidden={!data?.accountResponseModel}
                      onClick={() => {
                        handleSendAccount(id);
                      }}
                    >
                      {isSending ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-1"
                        />
                      ) : null}
                      {!isSending ? `Send Account` : `Sending...`}
                    </button>
                  </li>
                  <li>
                    <button
                      className={`dropdown-item ${data?.accountResponseModel?.active ? `text-danger` : `text-success`}`}
                      disabled={isSending}
                      hidden={!data?.accountResponseModel}
                      onClick={() => {
                        handleActiveAccount(data?.accountResponseModel?.id);
                      }}
                    >
                      {data?.accountResponseModel?.active ? `Deactive Account` : `Active Account`}
                    </button>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        }}
      />
      <div className="row g-3">
        {isGetCurEmployee && <GrowingSpinner></GrowingSpinner>}
        {!isGetCurEmployee && (
          <div className="col-xl-12 col-lg-12 col-md-12">
            <ClientProfileCard
              name={data?.employeeResponse?.name}
              code={data?.employeeResponse?.code}
              phone={data?.employeeResponse?.phone}
              email={data?.employeeResponse?.email}
              address={data?.employeeResponse?.currentAddress}
              enrollmentDate={data?.employeeResponse?.enrollmentDate}
              image={data?.employeeResponse?.profileImage}
              active={data?.employeeResponse?.active}
              dateofbirth={data?.employeeResponse?.dateOfBirth}
              citizenid={data?.employeeResponse?.citizenId}
              sex={data?.employeeResponse?.sex}
              nationality={data?.employeeResponse?.nationality}
              placeOfOrigrin={data?.employeeResponse?.placeOfOrigrin}
              placeOfResidence={data?.employeeResponse?.placeOfResidence}
              dateOfIssue={data?.employeeResponse?.dateOfIssue}
              issuedBy={data?.employeeResponse?.issuedBy}
            />
            <div className="row g-3">
              <div className="col-md-12">
                <DataTable
                  title={ClientInvoicesData.title}
                  columns={columnsT}
                  data={data?.storeList}
                  defaultSortField="title"
                  pagination
                  noDataComponent="No Working Store Available"
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              </div>
            </div>
          </div>
        )}
        {/* <div className="col-xl-4 col-lg-12 col-md-12">
                    <ClientTaskCard />
                </div> */}
      </div>
      <EditMemberModals
        show={isEditModal}
        onHide={() => setIsEditModal(false)}
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        onChangeImage={onChangeImage}
        handleEdit={handleEdit}
        button={button}
        setButton={setButton}
      ></EditMemberModals>
    </div>
  );
}

export default MemberProfile;
