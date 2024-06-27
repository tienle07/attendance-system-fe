import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function DeleteShiftModal(props) {
  const { show, onHide, id, foreUpdate,setIsDeleteShiftModal,setIsShiftDetailsModal,fore } = props;

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  const handleDelete = async(e) => {
    const status = {
        shiftId: id,
        status: -1,
        isForce: true
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
          setIsDeleteShiftModal(false)
          setIsShiftDetailsModal(false)
          fore()
          toast.success("Delete Shift Success");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
  };
  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Shift</Modal.Title>
        </Modal.Header>
          <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
          You had assign employee to work in this shift! Are you sure to delete this shift?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
                setIsDeleteShiftModal(false);
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
    </>
  );
}

export default DeleteShiftModal;
