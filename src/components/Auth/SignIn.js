import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/apiRequest";
import { Spinner } from "react-bootstrap";

function SignIn() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState(localStorage.getItem("picture"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const fetching = useSelector((state) => state.auth?.login?.isFetching);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const newuser = {
      username: username,
      password: password,
      refreshToken: "",
    };
    loginUser(newuser, dispatch, navigate);
  };
  const handleLoginAgain = async (e) => {
    e.preventDefault();
    const newuser = {
      refreshToken: localStorage.getItem("refresh"),
    };
    loginUser(newuser, dispatch, navigate);
  };
  const handleForget = async (e) => {
    localStorage.clear();
    setName("");
    setPicture("");
  };

  return (
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      <div
        className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: "32rem" }}
      >
        <form className="row g-1 p-3 p-md-4" onSubmit={handleLogin}>
          <div className="col-12 text-center mb-1 mb-lg-5">
            <h1 className="fw-bold">Sign In</h1>
          </div>
          {picture && (
            <>
              <div className="col-12 text-center mb-4">
                <a href="#!">
                  <img
                    src={picture}
                    alt=""
                    className="avatar xl rounded-circle img-thumbnail shadow-sm"
                  />
                </a>
                <h5 className="d-flex justify-content-center align-items-center pt-2">
                  {name}
                </h5>
              </div>
              <div className="col-12 text-center mb-4 ">
                <a
                  className="btn btn-lg btn-outline-secondary btn-block me-3"
                  onClick={handleLoginAgain}
                >
                  <span className="d-flex justify-content-center align-items-center">
                    Sign Me In
                  </span>
                </a>
                <a
                  className="btn btn-lg btn-outline-secondary btn-block"
                  onClick={handleForget}
                >
                  <span className="d-flex justify-content-center align-items-center">
                    Forget Me
                  </span>
                </a>
                <span className="dividers mt-4">OR</span>
              </div>
            </>
          )}
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label fw-bold">Employee Code</label>
              <input
                type="text"
                className="form-control form-control-lg"
                onChange={(e) => setUserName(e.target.value)}
                placeholder="B1Xxx0001"
                required
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <div className="form-label">
                <span className="d-flex justify-content-between align-items-center fw-bold">
                  Password
                  <Link style={{ color: "#787878d9" }} to="/forgot-password">
                    Forgot Password?
                  </Link>
                </span>
              </div>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="******"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="col-12">
            {/* <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                            <label className="form-check-label" for="flexCheckDefault">
                                Remember me
                            </label>
                        </div> */}
          </div>
          <div className="col-12 text-center mt-4">
            <button
              className="btn btn-lg btn-block btn-light lift text-uppercase fw-bold"
              type="submit"
              atl="signin"
              disabled={fetching}
            >
              {fetching ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
              ) : null}
              {!fetching ? `SIGN IN` : `pending...`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
