import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function NoteModal(props) {
  const {
    id,
    setIsAcceptModal,
    show,
    onHide,
    isAccept,
    foreUpdate,
  } = props;

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const [note, setNote] = useState("");
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {}, []);
  const handleAccept = async (e) => {
    e.preventDefault();
    const newStatus = {
      employeeShiftHistoryId: id,
      note: note,
    };
    try {
      const res = await axiosJWT.put(
        `api/employeeshifthistory/manager-response-leave-request?isApprove=${isAccept}`,
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        if (isAccept) {
          toast.success("Accept Leave Request Success");
        } else {
          toast.success("Reject Leave Request Success");
        }
        setIsAcceptModal(false);
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
          <Modal.Title className="fw-bold">Edit Shift Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form data-parsley-validate="" onSubmit={handleAccept}>
            <div className="mb-3">
              <label htmlFor="depone" className="form-label">
                Note
              </label>
              <input
                type="text"
                className="form-control"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="d-flex flex-row-reverse">
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NoteModal;
