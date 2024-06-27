import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GrowingSpinner from "../../../components/UI/GrowingSpinner";
import BrandInfoCard from "./BrandInfoCard";
import TypeAndPositionCard from "../TypeAndPositionCard";
import { loginSuccess } from "../../../redux/auth/authSlice";
import { createAxios } from "../../../createInstance";
import {
  getEmployeePosition,
  getEmployeeType,
} from "../../../redux/employee/employeeApi";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
function PosAndTypeTab(props) {
  const { tab } = props;
  const [loading, setLoading] = useState(false);
  const typeList = useSelector((state) => state.employees?.employeeType?.type);
  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  );
  const [button, setButton] = useState(false);
  const [editModeldata, setEditModeldata] = useState('');
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
  const [typeName, setTypeName] = useState("");
  const [positionName, setPositionName] = useState("");

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      getEmployeeType(dispatch, user?.data?.token?.accessToken, axiosJWT);
      getEmployeePosition(dispatch, user?.data?.token?.accessToken, axiosJWT);
    }
  }, [reducerValue]);
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
      const res = await axiosJWT.put(
        "api/position/" + duplicateId,
        objDuplicate,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

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
  return (
    <div className="card card-chat-body border-0 order-1 w-100 px-4 px-md-5 py-3 py-md-4">
      {loading && <GrowingSpinner></GrowingSpinner>}
      {!loading && (
        <>
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
        </>
      )}
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
          setEditModeldata("");
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
            This Type Is Exist But Disable In Your Brand, Do You Want To Enable
            It?
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
  );
}

export default PosAndTypeTab;
