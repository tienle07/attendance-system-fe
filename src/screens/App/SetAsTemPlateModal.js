import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function SetAsTemPlateModal(props) {
  const { show, onHide, id, foreUpdate,setIsSetAsTemplateModal } = props;

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  const handleSetAsTemplate = async(e) => {
      try {
        const res = await axiosJWT.put(
          "api/workschedule/manager-update-is-schedule-template/"+id,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
  
        if (res.data.code >= 200 && res.data.code < 300) {
         foreUpdate()
         setIsSetAsTemplateModal(false)
          toast.success("Set this calendar as template success!");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
  };
  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Set As Template</Modal.Title>
        </Modal.Header>
          <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-warning text-warning display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
          Are you sure to set this calender as template?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
                setIsSetAsTemplateModal(false);
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-success color-fff"
            onClick={() => {
                handleSetAsTemplate();
            }}
          >
            Sure
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default SetAsTemPlateModal;
