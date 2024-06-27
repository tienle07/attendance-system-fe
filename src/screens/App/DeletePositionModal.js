import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function DeletePositionModal(props) {
  const { show, onHide, id, foreUpdate, setIsDeletePositionModal } = props;

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
  }, []);
  const handleDelete = async (e) => {
    try {
      const res = await axiosJWT.put(
        "/api/shiftposition/manager-remove-shift-position/" + id,
        id,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Delete Position Success");
        setIsDeletePositionModal(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Shift Position</Modal.Title>
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
              setIsDeletePositionModal(false);
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

export default DeletePositionModal;
