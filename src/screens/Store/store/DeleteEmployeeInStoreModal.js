import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/auth/authSlice";

function DeleteEmployeeInStoreModal(props) {
  const { show, onHide, employeeInStoreId,storeId,setIsConfirmDeleteModel,fore } = props;

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  const handleDelete = async(e) => {
    const status = {
        employeeInStoreId: employeeInStoreId,
        storeId: storeId,
        isForce: true
      }
      try {
        const res = await axiosJWT.put(
          "api/employeeinstore/hr-remove-employee-in-store",
          status,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
  
        if (res.data.code >= 200 && res.data.code < 300) {
            setIsConfirmDeleteModel(false)
          fore()
          toast.success("Delete Employee Success");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
  };
  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Employee</Modal.Title>
        </Modal.Header>
          <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
          Employee is assigned to work in store! Are you sure to delete this employee?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
                setIsConfirmDeleteModel(false);
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

export default DeleteEmployeeInStoreModal;
