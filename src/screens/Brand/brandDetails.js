import React, { useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import PageHeader from "../../components/common/PageHeader";
import { getBrandDetailsForAdmin } from "../../redux/brand/brandApi";
import BrandDetailsCard from "./BrandDetailsCard";
import StatusCard from "../../components/Ticket/StatusCard";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../../firebase";
import moment from "moment";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import HrAccountModal from "./HrAccountModal";
import HrDetailsCard from "./HrDetailsCard";

function BrandDetails() {
  const { id } = useParams("id");
  const data = useSelector(
    (state) => state.brand?.currentBrandSelect?.curBrand?.brandResponseModel
  );
  const hr = useSelector(
    (state) =>
      state.brand?.currentBrandSelect?.curBrand?.employeeDetailResponseModels
        ?.employeeResponse
  );
  const account = useSelector(
    (state) =>
      state.brand?.currentBrandSelect?.curBrand?.employeeDetailResponseModels
        ?.accountResponseModel
  );
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState("");
  const [isCreatePositionModel, setisCreatePositionModel] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isDeleteTypeModel, setisDeleteTypeModel] = useState("");
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [form, setForm] = useState({});

  const [button, setButton] = useState(false);
  const [pending, setPending] = useState(false);

  const user = useSelector((state) => state.auth?.login?.currentUser);

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
      getBrandDetailsForAdmin(
        id,
        user?.data?.token?.accessToken,
        dispatch,
        axiosJWT
      );
    }
  }, [reducerValue]);
  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      setForm(data);
      setLogo(data?.logoUrl);
    }
  }, [data?.id]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleCreate = (e) => {
    e.preventDefault();
    if (image) {
      const imgRef = ref(imageDb, `avatar/${image.name}`);
      uploadBytes(imgRef, image).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setForm({ ...form, logoUrl: url });
          if (account) {
            handlePut(url);
          } else {
            handlePost(url);
          }
        });
      });
    } else {
      if (account) {
        handlePut();
      } else {
        handlePost();
      }
    }
  };
  const handlePost = async (link) => {
    const newEmployee = {
      fullName: form?.fullName,
      phone: form?.phone,
      email: form?.email,
      currentAddress: form?.currentAddress,
      level: 0,
      citizenId: form?.citizenId,
      dateOfBirth: form?.dateOfBirth,
      sex: form?.sex,
      nationality: form?.nationality,
      placeOfOrigrin: form?.placeOfOrigrin,
      placeOfResidence: form?.placeOfResidence,
      dateOfIssue: form?.dateOfIssue,
      issuedBy: form?.issuedBy,
      profileImage: link ? link : logo,
    };
    try {
      const res = await axiosJWT.post(
        "/api/systemadmin/admin-generate-hr-record/" + id,
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        toast.success("Add New Hr Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handlePut = async (link) => {
    const newEmployee = {
      fullName: form?.fullName,
      oldHRManagerId: hr?.id,
      brandId: id,
      phone: form?.phone,
      email: form?.email,
      currentAddress: form?.currentAddress,
      level: 0,
      citizenId: form?.citizenId,
      dateOfBirth: form?.dateOfBirth,
      sex: form?.sex,
      nationality: form?.nationality,
      placeOfOrigrin: form?.placeOfOrigrin,
      placeOfResidence: form?.placeOfResidence,
      dateOfIssue: form?.dateOfIssue,
      issuedBy: form?.issuedBy,
      profileImage: link ? link : logo,
    };
    try {
      const res = await axiosJWT.put(
        "/api/systemadmin/admin-change-new-hr-record",
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        toast.success("Change Hr Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  return (
    <div className="container-xxl">
      {isGetBranch && pending && <GrowingSpinner></GrowingSpinner>}
      {!isGetBranch && !pending && (
        <div>
          <PageHeader
            headerTitle="Brand Details"
            renderRight={() => {
              return (
                <div className="col-auto d-flex w-sm-100">
                  <button
                    className="btn btn-dark btn-set-task w-sm-100 me-2"
                    onClick={() => {
                      setIsModal(true);
                    }}
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>New HR
                  </button>
                  <button
                    className="btn btn-dark btn-set-task w-sm-100 me-2"
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                  >
                    <i className="icofont-exchange me-2 fs-6"></i>Deactive Brand
                  </button>
                </div>
              );
            }}
          />
          <div className="row g-3">
            <div className="col-xl-9 col-lg-12 col-md-12">
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <StatusCard
                    progress=""
                    details={data?.name}
                    iconClass="icofont-home fs-4"
                    iconbg="light-success-bg"
                    title="Brand"
                  />
                </div>
                <div className="col-md-4">
                  <StatusCard
                    progress=""
                    details={moment(data?.createDate).format("MMMM Do YYYY")}
                    iconClass="icofont-home fs-4"
                    iconbg="light-success-bg"
                    title="Create Date"
                  />
                </div>
                <div className="col-md-4">
                  <StatusCard
                    progress={data?.active ? "Active" : "Inactive"}
                    progressBg={data?.active ? "bg-success" : "bg-error"}
                    details=""
                    iconClass="icofont-price fs-4"
                    iconbg="light-success-bg"
                    title="Status"
                  />
                </div>
              </div>
              <BrandDetailsCard
                data={data && data}
                address={data?.address}
                name={data?.name}
                active={data?.active}
                id={data?.id}
                description={data?.description}
                createDate={data?.createDate}
                contactPerson={data?.contactPerson}
                logoUrl={data?.logoUrl}
                phone={data?.phone}
                role={user?.data?.account.roleId}
              />
            </div>
            {hr ? (
              <div className="col-xl-3 col-lg-12 col-md-12">
                <HrDetailsCard employee={hr} account={account} foreUpdate={foreUpdate}></HrDetailsCard>
              </div>
            ) : ''}
          </div>
          <HrAccountModal
            show={isModal}
            onHide={() => {
              setIsModal(false);
              setForm({});
            }}
            handleChange={handleChange}
            onChangeImage={onChangeImage}
            form={form}
            handleCreate={handleCreate}
            setForm={setForm}
          ></HrAccountModal>
          <Modal
            centered
            show={isCreatePositionModel}
            onHide={() => {
              setButton(true);
              setisCreatePositionModel(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Add New Position</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form data-parsley-validate="">
                <div className="mb-3">
                  <label htmlFor="depone" className="form-label"></label>
                  <input
                    type="text"
                    className="form-select"
                    // value={editModeldata ? positionName : null}
                    // onChange={(e)=>setPositionName(e.target.value)}
                    required
                  ></input>
                </div>
                <div className="d-flex flex-row-reverse">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
          <Modal
            show={isDeleteTypeModel}
            centered
            onHide={() => {
              setisDeleteTypeModel(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Type</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                Are you sure to delete this type?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setisDeleteTypeModel(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger color-fff"
                onClick={() => {}}
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
        show={isDeleteModal}
        centered
        onHide={() => {
          setPassword("");
          setDeleteModal(false);
          // setIsValid(true);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            Are you sure to delete this brand?
          </p>
          <div id="password" className="mb-3">
            <label htmlFor="deptwo" className="form-label">
              Enter Your Password To Confirm Delete
            </label>
            <div className="input-group flex-nowrap">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                aria-describedby="addon-wrapping"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setPassword("");
              setDeleteModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger color-fff"
            // onClick={() => handleDelete()}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
        </div>
      )}
    </div>
  );
}

export default BrandDetails;
