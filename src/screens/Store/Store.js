import React, { useEffect, useReducer, useState } from "react";
import { Modal, Nav, Tab } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import StoreCard from "../../components/Clients/StoreCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { getAllBranch } from "../../redux/apiRequest";
import { getProvince } from "../../redux/address/addressApi";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { toast } from "react-toastify";
import { getListEmployeeForPromte } from "../../redux/employee/employeeApi";
import AddressModal from "../Employee/addressModal";

function Stores(props) {
  const [isDeleteModal, setDeleteModal] = useState(false);

  const [button, setButton] = useState(false);
  const [isFetching, setisFetching] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [modalHeader, setModalHeader] = useState("");
  const [editModeldata, setEditModeldata] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isAddressModal, setIsAddressModal] = useState(false);
  const [isEditModalData, setIsEditModalData] = useState("");
  const [idforedit, setIdForEdit] = useState("");

  const [branchname, setBranchName] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [mngedit, setMngEdit] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [opentime, setOpentime] = useState("");
  const [closetime, setCloseTime] = useState("");
  const [manager, setManager] = useState(0);
  const [bssid, setBssid] = useState("");

  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  const role = localStorage.getItem("role");
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const branchList = useSelector((state) => state.branchs?.branchs?.allBranchs);
  const promotelist = useSelector(
    (state) => state.employees?.promoteList?.list
  );
  const isGetAllBranch = useSelector(
    (state) => state.branchs?.branchs?.isFetching
  );

  const regex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
  const active = true;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (user?.data?.account.roleId === 2) {
      if (user?.data?.token?.accessToken) {
        getAllBranch(user?.data?.token?.accessToken, dispatch, axiosJWT);
        getListEmployeeForPromte(
          user?.data?.token?.accessToken,
          dispatch,
          axiosJWT
        );
        getProvince(user?.data?.token?.accessToken, dispatch, axiosJWT);
      }
    }
  }, [reducerValue]);

  const changeManager = (e) => {
    const mngid = promotelist?.find((x) => x.id == e.target.value);
    setManager(mngid?.name);
    setMngEdit(mngid?.id);
  };
  const handleEditClick = async (d) => {
    setIsModal(true);
    setModalHeader("Edit Store");
    setBranchName(d.storeName);
    setBssid(d.bssid);
    setCloseTime(d.closeTime);
    setOpentime(d.openTime);
    setLatitude(d.latitude);
    setLongitude(d.longitude);
    setAddress(d.address);
    const mngid = promotelist?.find((x) => x.name == d.storeManager);
    setManager(d.storeManager);
    setMngEdit(mngid?.id);
    setIsEditModalData(true);
    setEditModeldata(d);
    setTimeout(() => {
      setisFetching(false);
    }, 300);
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    let open;
    let close;
    if (opentime.length > 5) {
      open = opentime;
    } else {
      open = opentime + ":00";
    }
    if (closetime.length > 5) {
      close = closetime;
    } else {
      close = closetime + ":00";
    }
    const newBranch = {
      storeName: branchname,
      address: address,
      latitude: latitude,
      longitude: longitude,
      openTime: open,
      closeTime: close,
      storeManagerId: mngedit,
      bssid: bssid,
    };
    if (isValid) {
      try {
        const res = await axiosJWT.post(
          "/api/store/hr-add-new-store",
          newBranch,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        setIsModal(false);
        setEditModeldata("");
        setIsValid(true);
        foreUpdate();
        toast.success("Create Branch Successfully");
      } catch (err) {
        toast.error("" + err?.response?.data?.message);
      }
    }
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    let open;
    let close;
    if (opentime?.length > 5) {
      open = opentime;
    } else {
      open = opentime + ":00";
    }
    if (closetime?.length > 5) {
      close = closetime;
    } else {
      close = closetime + ":00";
    }
    const newBranch = {
      storeName: branchname,
      address: address,
      latitude: latitude,
      longitude: longitude,
      openTime: open,
      closeTime: close,
      storeManagerId: idforedit,
      bssid: bssid,
    };
    if (isValid) {
      try {
        const res = await axiosJWT.put(
          "/api/store/hr-update-store-infor/" + idforedit,
          newBranch,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        setIsEditModalData(false);
        setEditModeldata("");
        setIsValid(true);
        setIsModal(false);
        foreUpdate();
        toast.success("Updated Branch Successfully");
      } catch (err) {
        toast.error("" + err?.response?.data?.message);
      }
    }
  };
  const handleDelete = async (d) => {
    const newStatus = {
      storeId: d,
      password: password,
    };
    try {
      const res = await axiosJWT.put("/api/store/hr-remove-store", newStatus, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      setIdForEdit("");
      setDeleteModal(false);
      toast.success("Delete Store Successfully");
      foreUpdate();
    } catch (err) {
      toast.error("Delete Store Fail");
    }
  };
  return (
    <div className="container-xxl">
      <Tab.Container defaultActiveKey="Active">
        <PageHeader
          headerTitle="Stores"
          renderRight={() => {
            return (
              <div className="d-flex py-2 project-tab flex-wrap w-sm-100">
                <button
                  type="button"
                  className="btn btn-dark w-sm-100"
                  onClick={() => {
                    setIsModal(true);
                    setModalHeader("Create Store");
                    setEditModeldata("");
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Create Store
                </button>
                <Nav
                  variant="pills"
                  className="nav nav-tabs tab-body-header rounded ms-3 prtab-set w-sm-100"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="Active">Active</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="nonActive">Inactive</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="All">All</Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>
            );
          }}
        />
        {isGetAllBranch && <GrowingSpinner></GrowingSpinner>}
        {!isGetAllBranch && (
          <div className="row align-items-center">
            <div className="col-lg-12 col-md-12 flex-column">
              <Tab.Content>
                <Tab.Pane eventKey="All">
                  <div className="row g-3 gy-5 py-3 row-deck">
                    {branchList
                      ? branchList.map((d, i) => {
                          return (
                            <div
                              key={"ljsdhl" + i}
                              className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 "
                            >
                              <StoreCard
                                storeName={d.storeName}
                                address={d.address}
                                mng={d.storeManager}
                                active={d.active}
                                onClickEdit={() => {
                                  setIsModal(true);
                                  setModalHeader("Edit Store");
                                  setEditModeldata(d);
                                  setIdForEdit(d.id);
                                  setIsEditModalData(true);
                                  setisFetching(true);
                                  handleEditClick(d);
                                }}
                                onClickDelete={() => {
                                  setDeleteModal(true);
                                  setIdForEdit(d.id);
                                }}
                                onClickView={() => {
                                  navigate(
                                    process.env.PUBLIC_URL + "/stores/" + d.id
                                  );
                                }}
                              />
                            </div>
                          );
                        })
                      : null}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="Active">
                  <div className="row g-3 gy-5 py-3 row-deck">
                    {branchList?.filter((item) => item.active === true)
                      ? branchList
                          ?.filter((item) => item.active === true)
                          .map((d, i) => {
                            return (
                              <div
                                key={"ljsdhl" + i}
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 "
                              >
                                <StoreCard
                                  storeName={d.storeName}
                                  address={d.address}
                                  mng={d.storeManager}
                                  active={d.active}
                                  onClickEdit={() => {
                                    setIsModal(true);
                                    setModalHeader("Edit Store");
                                    setEditModeldata(d);
                                    setIdForEdit(d.id);
                                    setIsEditModalData(true);
                                    setisFetching(true);
                                    handleEditClick(d);
                                  }}
                                  onClickDelete={() => {
                                    setDeleteModal(true);
                                    setIdForEdit(d.id);
                                  }}
                                  onClickView={() => {
                                    navigate(
                                      process.env.PUBLIC_URL + "/stores/" + d.id
                                    );
                                  }}
                                />
                              </div>
                            );
                          })
                      : null}
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="nonActive">
                  <div className="row g-3 gy-5 py-3 row-deck">
                    {branchList?.filter((item) => item.active === false)
                      ? branchList
                          ?.filter((item) => item.active === false)
                          .map((d, i) => {
                            return (
                              <div
                                key={"ljsdhl" + i}
                                className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 "
                              >
                                <StoreCard
                                  storeName={d.storeName}
                                  address={d.address}
                                  mng={d.storeManager}
                                  active={d.active}
                                  onClickEdit={() => {
                                    setButton(false);
                                    setIsModal(true);
                                    setModalHeader("Edit Store");
                                    setEditModeldata(d);
                                    setIdForEdit(d.id);
                                    setIsEditModalData(true);
                                    setisFetching(true);
                                    setManager(d.storeManager);
                                    handleEditClick(d);
                                  }}
                                  onClickDelete={() => {
                                    setDeleteModal(true);
                                    setIdForEdit(d.id);
                                  }}
                                  onClickView={() => {
                                    navigate(
                                      process.env.PUBLIC_URL + "/stores/" + d.id
                                    );
                                  }}
                                />
                              </div>
                            );
                          })
                      : null}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </div>
        )}
      </Tab.Container>
      <Modal
        centered
        show={isModal}
        onHide={() => {
          setButton(false);
          setAddress("");
          setIsModal(false);
          setEditModeldata("");
          setIsEditModalData(false);
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
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="depone" className="form-label">
                    Store Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="depone"
                    name="branchName"
                    value={editModeldata ? branchname : null}
                    onChange={(e) => setBranchName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                    BSS ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="deptwo"
                    value={editModeldata ? bssid : null}
                    onChange={(e) => {
                      setBssid(e.target.value);
                      regex.test(e.target.value)
                        ? setIsValid(true)
                        : setIsValid(false);
                    }}
                    required
                  />
                  {!regex.test(bssid) && button ? (
                    <span className="text-danger">Wrong fomat BSS ID</span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="deadline-form">
                {!isEditModalData && (
                  <div className="mb-3">
                    <label htmlFor="depone" className="form-label">
                      Manager
                    </label>
                    <select
                      className="form-select"
                      value={editModeldata ? mngedit : null}
                      onChange={changeManager}
                      required
                    >
                      <option></option>
                      {promotelist
                        ? promotelist.map((pro) => (
                            <option key={pro.id} value={pro.id}>
                              {pro.name}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                )}
                <div className="row g-3 mb-3">
                  <div className="mb-3">
                    <label htmlFor="deptwo" className="form-label">
                      Address
                    </label>
                    <div
                      className="input-group flex-nowrap"
                      onClick={(e) => {
                        setIsAddressModal(true);
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        value={address}
                        className="form-control"
                        placeholder="Click to set address"
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
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="Latitude" className="form-label">
                      Latitude
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="Latitude"
                      max="90"
                      min="0"
                      step="0.000001"
                      value={editModeldata ? latitude : null}
                      onChange={(e) => setLatitude(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="Longitude" className="form-label">
                      Longitude
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="Longitude"
                      max="180"
                      min="90"
                      step="0.000001"
                      value={editModeldata ? longitude : null}
                      onChange={(e) => setLongitude(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="open" className="form-label">
                      Open Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="open"
                      min="00:00"
                      max="23:59"
                      value={editModeldata ? opentime : null}
                      onChange={(e) => setOpentime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="close" className="form-label">
                      Close Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="close"
                      value={editModeldata ? closetime : null}
                      onChange={(e) => setCloseTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row-reverse">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => setButton(true)}
                >
                  Save
                </button>
              </div>
            </form>
          </Modal.Body>
        )}
      </Modal>

      <Modal
        show={isDeleteModal}
        centered
        onHide={() => {
          setPassword("");
          setDeleteModal(false);
          setIsValid(true);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Store</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            Are you sure to delete this store?
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
            onClick={() => handleDelete(idforedit)}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
      <AddressModal
        show={isAddressModal}
        // onClose={()=>{setisCurrentAddressModel(false)}}
        onClose={() => {
          setIsAddressModal(false);
        }}
        editModeldata={address}
        setaddressReturn={setAddress}
        // loading={setIsLoadingModal}
      ></AddressModal>
    </div>
  );
}

export default Stores;
