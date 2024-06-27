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
import { toast } from "react-toastify";
import EditMemberModals from "../Employee/EditMemberModals";
import ChangePasswordModal from "./ChangePasswordModal";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

let columnsT = [];
function Profile() {
  const id = useSelector(
    (state) => state.auth?.login?.currentUser?.data?.account?.employeeId
  );

  const [pending, setPending] = useState(false);
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const data = useSelector(
    (state) => state.employees?.currentSelectEmployee?.curEmployee
  );
  const isGetCurEmployee = useSelector(
    (state) => state.employees?.currentSelectEmployee?.isFetching
  );
  const [form, setForm] = useState([]);
  const [passowrdForm, setpassowrdForm] = useState([]);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isChangePasswordModal, setIsChangePasswordModal] = useState(false);
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
      getCurEmployeeSelect(id, dispatch, user?.data?.token?.accessToken,axiosJWT);
    }
  }, [reducerValue, id]);
  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      setForm(data?.employeeResponse);
      setImgUrl(data?.employeeResponse?.profileImage);
    }
  }, [data?.employeeResponse.id]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangePassword = (e) => {
    setpassowrdForm({ ...passowrdForm, [e.target.name]: e.target.value });
  };
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (
      passowrdForm?.newPassword === passowrdForm?.confirmPassword &&
      (passowrdForm?.newPassword).length > 5
    ) {
      try {
        const res = await axiosJWT.put(
          "/api/account/change-password",
          passowrdForm,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        if (res.data.code >= 200 && res.data.code < 300) {
          setIsChangePasswordModal(false);
          setButton(false);
          toast.success("Change Password Success");
          foreUpdate();
        }
      } catch (err) {
        toast.error("" + err?.response?.data?.message);
      }
    }
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
        setButton(false);
        toast.success("Edit Profile Success");
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
      sortable: true,
    },
    {
      name: "Assign  Date",
      selector: (row) => moment(row.assignedDate).format("DD-MM-YYYY"),
      sortable: true,
    },
    {
      name: "Type",
      selector: (row) => row.typeName,
      sortable: true,
    },
    {
      name: "Position",
      selector: (row) => row.positionName,
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
                hidden={localStorage.getItem('role') !== '2'}
                className="btn btn-dark btn-set-task w-sm-100 me-2"
                onClick={() => {
                  setIsEditModal(true);
                }}
              >
                <i className="icofont-edit me-2 fs-6"></i>Edit Profile
              </button>
              <button
                className="btn btn-dark btn-set-task w-sm-100 me-2"
                onClick={() => {
                  setIsChangePasswordModal(true);
                }}
              >
                <i className="icofont-key-hole me-2 fs-6"></i>Change Password
              </button>
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
              enrollmentDate={data?.employeeResponse?.enrollmentDate}
              address={data?.employeeResponse?.currentAddress}
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
            {localStorage.getItem("role") !== "2" && (
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
            )}
          </div>
        )}
        {/* <div className="col-xl-4 col-lg-12 col-md-12">
                    <ClientTaskCard />
                </div> */}
      </div>
      <EditMemberModals
        show={isEditModal}
        onHide={() => {
          setIsEditModal(false);
          setButton(false);
        }}
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        onChangeImage={onChangeImage}
        handleEdit={handleEdit}
        button={button}
        setButton={setButton}
      ></EditMemberModals>
      <ChangePasswordModal
        show={isChangePasswordModal}
        onHide={() => {
          setIsChangePasswordModal(false);
          setButton(false);
          setpassowrdForm([]);
        }}
        handleChangePasswordSubmit={handleChangePasswordSubmit}
        handleChange={handleChangePassword}
        button={button}
        form={passowrdForm}
        setForm={setpassowrdForm}
        setButton={setButton}
      ></ChangePasswordModal>
    </div>
  );
}

export default Profile;
