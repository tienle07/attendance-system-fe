import React, { useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import PageHeader from "../../components/common/PageHeader";
import TypeAndPositionCard from "./TypeAndPositionCard";
import {
  getEmployeePosition,
  getEmployeeType,
} from "../../redux/employee/employeeApi";
import BrandDetailsCard from "./BrandDetailsCard";
import {
  getAllBrandTimeFrame,
  getBrandDetails,
} from "../../redux/brand/brandApi";
import StatusCard from "../../components/Ticket/StatusCard";
import moment from "moment";
import BrandModel from "./brandModel";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../../firebase";
import BrandTimeFrame from "./brandTimeFrame";
import TimeFrameModal from "./TimeFrameModal";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function Brand() {
  const id = localStorage.getItem("brand");
  const data = useSelector(
    (state) => state.brand?.currentBrandSelect?.curBrand
  );
  const timeframe = useSelector((state) => state.brand?.timeFrame?.frame);
  const [editModeldata, setEditModeldata] = useState('');
  const [isModal, setIsModal] = useState(false);
  const [isTimeFrameModal, setIsTimeFrameModal] = useState(false);
  const [timeframeform, setTimeFrameForm] = useState({});
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    contactPerson: "",
    phone: "",
    description: "",
    logoUrl: "",
  });
  const [isEditTimeFrame, setIsEditTimeFrame] = useState(false);
  const [isCreatePositionModel, setisCreatePositionModel] = useState(false);
  const [isCreateTypeModel, setisCreateTypeModel] = useState(false);
  const [isDeletePositionModel, setisDeletePositionModel] = useState(false);
  const [isDeleteTypeModel, setisDeleteTypeModel] = useState(false);
  const [isDuplicateTypeNameModal, setIsDuplicateTypeNameModal] =
    useState(false);
  const [isDuplicatePositionNameModal, setIsDuplicatePositionNameModal] =
    useState(false);
  const [duplicateId, setDuplicateId] = useState(false);
  const [objDuplicate, setObjDuplicate] = useState(false);

  const [idforedit, setIdForEdit] = useState("");
  const [type, setType] = useState("");

  const [typeName, setTypeName] = useState("");
  const [position, setPosition] = useState("");
  const [positionName, setPositionName] = useState("");

  const [button, setButton] = useState(false);
  const [pending, setPending] = useState(false);

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const typeList = useSelector((state) => state.employees?.employeeType?.type);
  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  );
  const isGetBranch = useSelector(
    (state) => state.branchs?.currentBranchSelect?.isFetching
  );

  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.token?.accessToken) {
      getBrandDetails(id, user?.data?.token?.accessToken, dispatch,axiosJWT);
      getAllBrandTimeFrame(id, user?.data?.token?.accessToken, dispatch,axiosJWT);
      getEmployeeType(dispatch, user?.data?.token?.accessToken,axiosJWT);
      getEmployeePosition(dispatch, user?.data?.token?.accessToken,axiosJWT);
    }
  }, [reducerValue]);
  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      setForm(data);
      setLogo(data?.logoUrl);
    }
  }, [data?.id]);
  const handleEditClick = (id, e) => {
    e.preventDefault();
  };
  const handleEditTimeFrameClick = async(timeframeid) => {
    try {
      const response = await axiosJWT.get(`/api/timeframe/`+timeframeid, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      setTimeFrameForm(response.data.data);
      setIsEditTimeFrame(true)
      setEditModeldata(response.data.data)
      setIsTimeFrameModal(true)
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  
  const handleCreate = async (e) => {
    e.preventDefault();
    const newPos = {
      active: true,
      name: positionName,
    };
    const pos = positionList.find((pos) => pos.name === positionName);
    if (pos) {
      setObjDuplicate(newPos);
      setDuplicateId(pos.id);
      setIsDuplicatePositionNameModal(true);
      return;
    }
    try {
      const res = await axiosJWT.post("api/position", newPos, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });

      if (res.data.code >= 200 && res.data.code < 300) {
        setisCreatePositionModel(false);
        setEditModeldata([]);
        toast.success("Add Position Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleChangeDuplicatePositionName = async () => {
    try {
      const res = await axiosJWT.put("api/position/" + duplicateId, objDuplicate, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });

      if (res.data.code >= 200 && res.data.code < 300) {
        setisCreatePositionModel(false);
        setIsDuplicatePositionNameModal(false);
        setEditModeldata("");
        toast.success("Add Position Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleDeletePosition = async (idDelete) => {
    try {
      const res = await axiosJWT.delete("/api/position/" + idDelete, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Delete Position Successfully");
        setisDeletePositionModel(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleCreateType = async (e) => {
    e.preventDefault();
    const newPos = {
      active: true,
      name: typeName,
    };
    const type = typeList.find((type) => type.name === typeName);
    if (type) {
      setObjDuplicate(newPos);
      setDuplicateId(type.id);
      setIsDuplicateTypeNameModal(true);
      return;
    }
    try {
      const res = await axiosJWT.post("api/employeetype", newPos, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });

      if (res.data.code >= 200 && res.data.code < 300) {
        setisCreateTypeModel(false);
        setEditModeldata([]);
        toast.success("Add Type Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleChangeDuplicateTypeName = async () => {
    try {
      const res = await axiosJWT.put(
        "api/employeetype/" + duplicateId,
        objDuplicate,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        setisCreateTypeModel(false);
        setIsDuplicateTypeNameModal(false);
        setEditModeldata([]);
        toast.success("Add Type Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangeTimeFrame = (e) => {
    setTimeFrameForm({ ...timeframeform, [e.target.name]: e.target.value });
  };
  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleEdit = (e) => {
    e.preventDefault();
    if (image) {
      const imgRef = ref(imageDb, `logobrand/${image.name}`);
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
  const handleUpload = async (link) => {
    const newBrand = {
      name: form?.name,
      address: form?.address,
      contactPerson: form?.contactPerson,
      phone: form?.phone,
      description: form?.description,
      logoUrl: link ? link : logo,
    };
    try {
      const res = await axiosJWT.put(
        "/api/brand/update-brand-infor/" + id,
        newBrand,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setEditModeldata([]);
        toast.success("Edit Account Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  const handleDeleteType = async (idDelete) => {
    try {
      const res = await axiosJWT.delete("/api/employeetype/" + idDelete, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Delete Type Successfully");
        setisDeleteTypeModel(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleEditTimeFrame = async (e) => {
    e.preventDefault();
  try {
    const res = await axiosJWT.put(
      "/api/timeframe/update-time-frame-infor/" + timeframeform.id,
      timeframeform,
      {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      }
    );
    if (res.data.code >= 200 && res.data.code < 300) {
      setIsTimeFrameModal(false);
      setEditModeldata('');
      setIsEditTimeFrame(false)
      toast.success("Edit Time Frame Success");
      foreUpdate();
    }
  } catch (err) {
      toast.error("" + err?.response?.data?.message);
  }
  }
  const handleCreateTimeFrame = async (e) => {
    e.preventDefault();
  try {
    const res = await axiosJWT.post(
      "/api/timeframe",
      timeframeform,
      {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      }
    );
    if (res.data.code >= 200 && res.data.code < 300) {
      setIsTimeFrameModal(false);
      setEditModeldata('');
      setIsEditTimeFrame(false)
      toast.success("Create Time Frame Success");
      foreUpdate();
    }
  } catch (err) {
      toast.error("" + err?.response?.data?.message);
  }
  }
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
                    className="btn btn-dark btn-set-task w-sm-100"
                    onClick={() => {
                      setIsModal(true);
                    }}
                  >
                    <i className="icofont-edit me-2 fs-6"></i>Edit Brand
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
                    details={moment(data?.createDate).format("DD-MM-YYYY")}
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
                id={data?.id}
                phone={data?.phone}
                contactPerson={data?.contactPerson}
                description={data?.description}
                logoUrl={data?.logoUrl}
                active={data?.active}
                role={user?.data?.account.roleId}
              />
              <div className="row g-3 mb-3">
                <div className="col-md-12">
                  <div className="row g-3 mb-3">
                    <div className="col-lg-6 col-md-6">
                      <TypeAndPositionCard
                        data={typeList?.filter((type) => type.active === true)}
                        title="Type Of Employee"
                        onClickAdd={() => setisCreateTypeModel(true)}
                        onClickDelete={(id) => {
                          setisDeleteTypeModel(true);
                          setIdForEdit(id);
                        }}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <TypeAndPositionCard
                        data={positionList?.filter(
                          (position) => position.active === true
                        )}
                        title="Position Of Employee"
                        onClickAdd={() => setisCreatePositionModel(true)}
                        onClickDelete={(id) => {
                          setisDeletePositionModel(true);
                          setIdForEdit(id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-12 col-md-12">
              <BrandTimeFrame
                list={timeframe}
                onClickAdd={()=>{setIsEditTimeFrame(false);setIsTimeFrameModal(true)}}
                handleEditClick={handleEditTimeFrameClick}
                // data={positionList}
                // title="Position Of Employee"
                // onClickAdd={() => setisCreatePositionModel(true)}
                // onClickDelete={(id) => { setisDeletePositionModel(true); setIdForEdit(id) }}
              />
            </div>
          </div>
          <BrandModel
            isModal={isModal}
            onHide={() => {
              setIsModal(false);
              setForm(data);
            }}
            handleChange={handleChange}
            onChangeImage={onChangeImage}
            form={form}
            setForm={setForm}
            handleEdit={handleEdit}
            isEditModalData={true}
          ></BrandModel>
          <TimeFrameModal
            onHide={() => {setIsTimeFrameModal(false);setTimeFrameForm([]);setEditModeldata([]);setButton(false)}}
            isModal={isTimeFrameModal}
            isFetching={pending}
            form={timeframeform}
            isEdit={isEditTimeFrame}
            handleEdit={handleEditTimeFrame}
            handleCreate={handleCreateTimeFrame}
            handleChange={handleChangeTimeFrame}
            button={button}
            foreUpdate={foreUpdate}
            setButton={setButton}
            setIsModal={setIsModal}
          ></TimeFrameModal>
          <Modal
            centered
            show={isCreatePositionModel}
            onHide={() => {
              setButton(false);
              setisCreatePositionModel(false);
              setEditModeldata("");
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Add New Position</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form data-parsley-validate="" onSubmit={handleCreate}>
                <div className="mb-3">
                  <label htmlFor="depone" className="form-label"></label>
                  <input
                    type="text"
                    className="form-control"
                    value={editModeldata ? positionName : null}
                    onChange={(e) => setPositionName(e.target.value)}
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
            centered
            show={isCreateTypeModel}
            onHide={() => {
              setButton(true);
              setisCreateTypeModel(false);
              setEditModeldata('');
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Add New Type</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form data-parsley-validate="" onSubmit={handleCreateType}>
                <div className="mb-3">
                  <label htmlFor="depone" className="form-label"></label>
                  <input
                    type="text"
                    className="form-control"
                    value={editModeldata ? typeName : null}
                    onChange={(e) => setTypeName(e.target.value)}
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
            show={isDeletePositionModel}
            centered
            onHide={() => {
              setisDeletePositionModel(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Position</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                Are you sure to delete this position?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setisDeletePositionModel(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger color-fff"
                onClick={() => {
                  handleDeletePosition(idforedit);
                }}
              >
                Delete
              </button>
            </Modal.Footer>
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
                onClick={() => {
                  handleDeleteType(idforedit);
                }}
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            centered
            show={isDuplicateTypeNameModal}
            onHide={() => {
              setIsDuplicateTypeNameModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Type Name Exist</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-warning-alt text-warning display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                This Type Is Exist But Disable In Your Brand, Do You Want To
                Enable It?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsDuplicateTypeNameModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger color-fff"
                onClick={() => {
                  handleChangeDuplicateTypeName();
                }}
              >
                Ok
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            centered
            show={isDuplicatePositionNameModal}
            onHide={() => {
              setIsDuplicatePositionNameModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Position Name Exist</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-warning-alt text-warning display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                This Position Is Exist But Disable In Your Brand, Do You Want To
                Enable It?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsDuplicatePositionNameModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger color-fff"
                onClick={() => {
                  handleChangeDuplicatePositionName();
                }}
              >
                Ok
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default Brand;
