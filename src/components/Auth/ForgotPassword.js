import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleImg from "../../assets/images/forgot-password.svg";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    const newuser = {
      username: username,
      email: email,
    };
    try {
      const res = await axios.put("api/account/forgot-password", newuser);
      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Reset Account Success, Check Your Mails !!");
        navigate("/sign-in");
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  };
  return (
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      <div
        className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: "32rem" }}
      >
        <form className="row g-1 p-3 p-md-4" onSubmit={handleReset}>
          <div className="col-12 text-center mb-1 mb-lg-5">
            <img src={GoogleImg} className="w240 mb-4" alt="" />
            <h1>Forgot password?</h1>
            <span>
              Enter the your employee code and email address and we'll send you
              instructions to reset your password.
            </span>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">Employee Code</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={username}
                onChange={(e)=>{setUserName(e.target.value)}}
                placeholder="B1abc0001"
                required
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="name@example.com"
                value={email}
                onChange={(e)=>{setEmail(e.target.value)}}
                required
              />
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-lg btn-block btn-light lift text-uppercase">
              SUBMIT
            </button>
          </div>
          <div className="col-12 text-center mt-4">
            <span className="text-muted">
              <Link to="/sign-in" className="text-danger">
                Back to Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
