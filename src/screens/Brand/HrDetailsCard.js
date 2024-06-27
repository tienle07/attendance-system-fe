import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/auth/authSlice";
import { createAxios } from "../../createInstance";
import { toast } from "react-toastify";

function HrDetailsCard(props) {
  const { employee, account,foreUpdate } = props;
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  const handleSendAccount = async() => {
    setIsLoading(true)
    try {
      const res = await axiosJWT.post(
        "/api/account/send-account/" + employee?.id,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Send Account For Hr Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
    setIsLoading(false)
  }
  return (
    <div className="card">
      <div className="card-header py-3 d-flex align-items-center justify-content-between">
        <h6 className="mb-0 fw-bold text-danger">Current HR</h6>
        <button
          className="btn btn-dark"
          disabled={isLoading}
          onClick={handleSendAccount}
        >
          {isLoading ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-1"
            />
          ) : null}
          {!isLoading ? <i className="icofont-ui-lock me-2 fs-6"></i> : ``}
          {!isLoading ? `Send Account` : `Sending...`}
        </button>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mb-0">
          <li className="row flex-wrap mb-3">
            <div
              key={"asdad"}
              className="py-2 d-flex align-items-center border-bottom"
            >
              <div className="d-flex ms-2 align-items-center flex-fill">
                <img
                  src={employee?.profileImage}
                  className="avatar lg rounded-circle img-thumbnail"
                  alt="avatar"
                />
                <div className="d-flex flex-column ps-2">
                  <h6 className="fw-bold mb-0">{employee?.name}</h6>
                  <span className="small text-muted">{employee?.code}</span>
                </div>
              </div>
              {/* <h6 className="fw-bold mb-0">{employee?.positionName}</h6> */}
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-4">
                <span className="fw-bold">Email</span>
              </div>
              <div className="col-8">
                <span className="text-muted">{employee?.email}</span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-4">
                <span className="fw-bold">Phone</span>
              </div>
              <div className="col-8">
                <span className="text-muted">{employee?.phone}</span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-4">
                <span className="fw-bold">Address</span>
              </div>
              <div className="col-8">
                <span className="text-muted">{employee?.currentAddress}</span>
              </div>
            </div>
          </li>
          <li className="row flex-wrap mb-3">
            <div className="py-2 d-flex align-items-center border-bottom">
              <div className="col-4">
                <span className="fw-bold">Account</span>
              </div>
              <div className="col-8">
                {account ? (
                  <span className="badge bg-success">Sended</span>
                ) : (
                  <span className="badge bg-danger">Not Send</span>
                )}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default HrDetailsCard;
