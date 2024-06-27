import React, { useState } from "react";
import { Modal } from "react-bootstrap";

function ChangePasswordModal(props) {
  const {
    onHide,
    show,
    form,
    setForm,
    button,
    setButton,
    handleChange,
    handleChangePasswordSubmit,
  } = props;
  return (
    <div>
      <Modal
        centered
        show={show}
        onHide={onHide}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Change password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="changepassword" data-parsley-validate="" onSubmit={handleChangePasswordSubmit}>
            <div className="mb-3">
              <label htmlFor="depone" className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                name="oldPassword"
                value={form?.oldPassword}
                onChange={handleChange}
                required
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="depone" className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={form?.newPassword}
                onChange={handleChange}
                required 
                data-parsley-minlength="6"
              ></input>
              {(form?.newPassword)?.length < 6  && button ? (
                    <span className="text-danger">
                      Password must be at least 6 characters long
                    </span>
                  ) : (
                    ""
                  )}
            </div>
            <div className="mb-3">
              <label htmlFor="depone" className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={form?.confirmPassword}
                onChange={handleChange}
                required
              ></input>
              {form?.newPassword !== form?.confirmPassword && button ? (
                    <span className="text-danger">
                      Password and Comfirm Password not match!
                    </span>
                  ) : (
                    ""
                  )}
            </div>
            <div className="d-flex flex-row-reverse">
              <button type="submit" form="changepassword" onClick={()=>setButton(true)} className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}


export default ChangePasswordModal;