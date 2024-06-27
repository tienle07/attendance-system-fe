
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import EmployeeAvailable from "../Shift/EmployeeAvailable";
import { Modal, Nav } from "react-bootstrap";
import ShiftInfor from "../Shift/ShiftInfor";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getShiftDetails } from "../../redux/workschedule/workscheduleApi";
import EmployeeShift from "../Shift/EmployeeShift";
import { useReducer } from "react";
import PositionInShift from "../Shift/PositionInShift";
import { useState } from "react";
import EditShiftInfoModal from "./EditShiftInfoModal";
import EditPositionInShiftModal from "./EditPositionInShiftModal";
import AddNewPositionModal from "./AddNewPositionModal";
import DeletePositionModal from "./DeletePositionModal";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { toast } from "react-toastify";
import DeleteShiftModal from "./DeleteShiftModal";

function ShiftDetailsModal(props) {
  const { id, show, onHide, onClickEdit,isShiftDetailsModal,setIsShiftDetailsModal,fore } = props;
  const [isEditShiftInfoModal, setIsEditShiftInfoModal] = useState(false);
  const [isEditPositionInShiftModal, setIsEditPositionInShiftModal] =
    useState(false);
  const [isAddNewPositionModal, setIsAddNewPositionModal] = useState(false);
  const [isDeletePositionModal, setIsDeletePositionModal] = useState(false);
  const [isDeleteShiftModal, setIsDeleteShiftModal] = useState(false);
  const [idPosForDelete, setIdPosForDelete] = useState("");

  const shiftInfo = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.workShift
  );
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    if (id) {
      getShiftDetails(id, dispatch, user?.data?.token?.accessToken,axiosJWT);
    }
  }, [id, reducerValue,isShiftDetailsModal]);
  const handleDelete =async () => {
    const status = {
      shiftId: id,
      status: -1,
      isForce: false
    }
    try {
      const res = await axiosJWT.put(
        "api/workshift/manager-update-shift-status",
        status,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        setIsShiftDetailsModal(false)
        fore()
        toast.success("Delete Shift Success");
      }
    } catch (err) {
      if (err?.response?.data?.code === 409) {
        setIsDeleteShiftModal(true)
      }
      toast.error(err?.response?.data?.message);
    }
  }
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        contentClassName="modal-height"
        dialogClassName="my-modal"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title
            className="fw-bold project-tab"
            id="example-custom-modal-styling-title"
          >
            Shift Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body id="example-custom-modal-styling-title">
          <div className="modal-body">
            <div className="row clearfix g-3">
              <div className="col-lg-12 col-md-12 flex-column">
                <div className="row g-3 row-deck">
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                    <ShiftInfor
                      id={id}
                      onClickEditShiftInfo={() => {
                        setIsEditShiftInfoModal(true);
                      }}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                    <PositionInShift
                      setIsEditPositionInShiftModal={
                        setIsEditPositionInShiftModal
                      }
                      setIsAddNewPositionModal={setIsAddNewPositionModal}
                      setIsDeletePositionModal={setIsDeletePositionModal}
                      setPosIdForDelete={setIdPosForDelete}
                    />
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12">
                    <EmployeeAvailable />
                  </div>
                </div>

                <EmployeeShift 
                  foreUpdate={foreUpdate} 
                  id={id}  
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="button" hidden={localStorage.getItem('role')!=='3'} className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
      <EditShiftInfoModal
        show={isEditShiftInfoModal}
        id={id}
        data={shiftInfo}
        onHide={() => setIsEditShiftInfoModal(false)}
        foreUpdate={foreUpdate}
        setIsEditShiftInfoModal={setIsEditShiftInfoModal}
      ></EditShiftInfoModal>
      <EditPositionInShiftModal
        show={isEditPositionInShiftModal}
        isEditPositionInShiftModal={isEditPositionInShiftModal}
        onHide={() => setIsEditPositionInShiftModal(false)}
        id={id}
        foreUpdate={foreUpdate}
        setIsEditPositionInShiftModal={setIsEditPositionInShiftModal}
      ></EditPositionInShiftModal>
      <AddNewPositionModal
        show={isAddNewPositionModal}
        onHide={() => setIsAddNewPositionModal(false)}
        setIsAddNewPositionModal={setIsAddNewPositionModal}
        foreUpdate={foreUpdate}
        isAddNewPositionModal={isAddNewPositionModal}
      ></AddNewPositionModal>
      <DeletePositionModal
        show={isDeletePositionModal}
        id={idPosForDelete}
        onHide={() => setIsDeletePositionModal(false)}
        foreUpdate={foreUpdate}
        setIsDeletePositionModal={setIsDeletePositionModal}
      ></DeletePositionModal>
      <DeleteShiftModal
        show={isDeleteShiftModal}
        id={id}
        onHide={() => setIsDeleteShiftModal(false)}
        foreUpdate={foreUpdate}
        setIsDeleteShiftModal={setIsDeleteShiftModal}
        setIsShiftDetailsModal={setIsShiftDetailsModal}
        fore={fore}
      ></DeleteShiftModal>
    </>
  );
}

export default ShiftDetailsModal;
