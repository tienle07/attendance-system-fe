import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function NewEmployeeNotification(props) {
  const { onClose, show, foreUpdate, listId,setEmployeeComingModal } = props;
  const [isCheck, setIsCheck] = useState(false);
  const storeid = localStorage.getItem("storeid");
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  const handlePostStatus = async(newStatus) =>{
    try {
      const res = await axiosJWT.put(
        "/api/employeeinstore/store-manager-update-employee-in-store-status",
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      setEmployeeComingModal(false)
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  }
  const handleOkClick = async (e) => {
    e.preventDefault();
    if(isCheck){
      listId.forEach((id, i) =>{
        let newStatus = {
          employeeInStoreId: id,
          storeId:storeid,
          status: 1,
        };
        handlePostStatus(newStatus)
      })
      foreUpdate();   
    }else{
      setEmployeeComingModal(false);
    }
  };
  return (
    <Modal centered show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">New Employee Is Coming!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="justify-content-center flex-column d-flex">
        <i className="icofont-brand-slideshare text-success display-2 text-center mt-2"></i>
        <p className="mt-4 fs-5 text-center">
          New employee is adding to your store! Check it please!
        </p>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <label className="d-flex flex-row-reverse control-inline fancy-checkbox justify-content-center align-items-center">
            <input
              type="checkbox"
              onChange={(e) => setIsCheck(e.target.checked)}
            />
            <span className="ms-2 small pe-2">Don't ask me again</span>
          </label>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary color-fff"
            onClick={(e) => {
              handleOkClick(e);
            }}
          >
            OK
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
export default NewEmployeeNotification;
