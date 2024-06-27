import React from "react";
import { Dropdown, Modal } from "react-bootstrap";
import Avatar2 from "../../assets/images/xs/avatar2.jpg";
import Avatar3 from "../../assets/images/xs/avatar3.jpg";
import Avatar8 from "../../assets/images/xs/avatar8.jpg";
import AddressModal from "./addressModal";
import { useState } from "react";
import moment from 'moment';



function EditMemberModals(props) {
  const {
    onHide,
    show,
    form,
    setForm,
    handleChange,
    onChangeImage,
    handleEdit,
    currentAddress,
    button,
    setButton,
    setplaceOfOrigrin,
    setplaceOfResidence,
  } = props;
  const [isPlaceOfOriginModal, setisPlaceOfOriginModal] = useState(false);
  const [isCurrentAddressModel, setisCurrentAddressModel] = useState(false);
  const [isPlaceOfResidentModel, setisPlaceOfResidentModel] = useState(false);

  return (
    <div>
    <Modal
        centered
        show={show}
        size="lg"
        onHide={onHide}
      >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Edit Profile</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <form
            id="advanced-form"
            onSubmit={handleEdit}
          >
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput877"
                  className="form-label"
                >
                  Employee Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="exampleFormControlInput877"
                  placeholder="Explain what the Employee Name"
                  value={form?.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput477"
                    className="form-label"
                  >
                    Employee Code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput477"
                    readOnly
                    name="code"
                    placeholder="Code"
                    value={form?.code || ""}
                    onChange={handleChange}
                    // required
                  />
                </div>
                <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput777"
                    className="form-label"
                  >
                    Citizen ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput977"
                    placeholder="Explain what the Citizen ID"
                    name="citizenId"
                    value={form?.citizenId || ""}
                    onChange={handleChange}
                    required
                    data-parsley-length="12"
                  />
                  {(form?.citizenId)?.length != 12 && button ? (
                    <span className="text-danger">
                      Citizen ID is 12 character
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1778"
                  className="form-label"
                >
                  Current Address
                </label>
                <div
                  className="input-group flex-nowrap"
                  onClick={(e) => {
                    setisCurrentAddressModel(true);
                  }}
                >
                  <input
                    type="text"
                    readOnly
                    value={form?.currentAddress}
                    name="currentAddress"
                    className="form-control"
                    placeholder="Click to set address"
                    aria-label="search"
                    aria-describedby="addon-wrapping"
                  />
                  <button
                    type="button"
                    className="input-group-text"
                    id="addon-wrapping"
                  >
                    <i className="icofont-ui-edit"></i>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formFileMultipleoneone" className="form-label">
                  Employee Profile Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  name="profileImage"
                  id="formFileMultipleoneone"
                  onChange={onChangeImage}
                />
              </div>
              <div className="deadline-form">
                <div className="mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="sex"
                    value={form?.sex}
                    onChange={handleChange}
                    required
                  >
                    <option></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput477"
                      className="form-label"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="exampleFormControlInput477"
                      name="email"
                      placeholder="Email"
                      value={form?.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput777"
                      className="form-label"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput777"
                      placeholder="Phone"
                      name="phone"
                      value={form?.phone}
                      onChange={handleChange}
                      required
                      data-parsley-length="[7,13]"
                    />
                    {!(form?.phone)?.startsWith("0") && button ? (
                      <span className="text-danger">
                        Not Valid Phone Number
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput477"
                      className="form-label"
                    >
                      Date of birth
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="exampleFormControlInput477"
                      name="dateOfBirth"
                      placeholder="Date of birth"
                      value={moment(form?.dateOfBirth).format('YYYY-MM-DD')}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput477"
                      className="form-label"
                    >
                      National
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="nationality"
                      id="exampleFormControlInput477"
                      value={form?.nationality}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput777"
                    className="form-label"
                  >
                    Place Of Origin
                  </label>
                  <div
                    className="input-group flex-nowrap"
                    onClick={(e) => setisPlaceOfOriginModal(true)}
                  >
                    <input
                      type="text"
                      readOnly
                      name="placeOfOrigrin"
                      value={form?.placeOfOrigrin}
                      className="form-control"
                      placeholder="Click to set address"
                      aria-label="search"
                      aria-describedby="addon-wrapping"
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      id="addon-wrapping"
                    >
                      <i className="icofont-ui-edit"></i>
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="exampleFormControlInput777"
                    className="form-label"
                  >
                    Place Of Residence
                  </label>
                  <div
                    className="input-group flex-nowrap"
                    onClick={(e) => setisPlaceOfResidentModel(true)}
                  >
                    <input
                      type="text"
                      readOnly
                      name="placeOfResidence"
                      value={form?.placeOfResidence}
                      className="form-control"
                      placeholder="Click to set address"
                      aria-label="search"
                      aria-describedby="addon-wrapping"
                    />
                    <button
                      type="button"
                      className="input-group-text"
                      id="addon-wrapping"
                    >
                      <i className="icofont-ui-edit"></i>
                    </button>
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput477"
                      className="form-label"
                    >
                      Date of Issue
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfIssue"
                      id="exampleFormControlInput477"
                      value={moment(form?.dateOfIssue).format('YYYY-MM-DD')}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-lg-6">
                    <label
                      htmlFor="exampleFormControlInput477"
                      className="form-label"
                    >
                      Issue By
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="issuedBy"
                      id="exampleFormControlInput477"
                      placeholder="National"
                      value={form?.issuedBy}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" id="employeeForm">
          Done
        </button>
        <button
          type="submit"
          form="advanced-form"
          className="btn btn-primary"
          onClick={() => {
            setButton(true);
          }}
        >
          Save
        </button>
      </Modal.Footer>
    </Modal>
    <AddressModal
    show={isCurrentAddressModel}
    // onClose={()=>{setisCurrentAddressModel(false)}}
    onClose={() => {
      setisCurrentAddressModel(false);
    }}
    editModeldata={currentAddress}
    setaddressReturn={form?.setcurrentAddress}
  ></AddressModal>
  <AddressModal
    show={isPlaceOfOriginModal}
    // onClose={()=>{setisPlaceOfOriginModal(false);}}
    onClose={() => {
      setisPlaceOfOriginModal(false);
    }}
    editModeldata={form?.placeOfOrigrin}
    setaddressReturn={setplaceOfOrigrin}
  ></AddressModal>
  <AddressModal
    show={isPlaceOfResidentModel}
    // onClose={()=>{setisPlaceOfResidentModel(false);}}
    onClose={() => {
      setisPlaceOfResidentModel(false);
    }}
    editModeldata={form?.placeOfResidence}
    setaddressReturn={setplaceOfResidence}
  ></AddressModal>
  </div>
  );
}

export default EditMemberModals;
