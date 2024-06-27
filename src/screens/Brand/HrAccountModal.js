import { Modal } from "react-bootstrap";
import { useState } from "react";
import AddressModal from "./addressModal";

function HrAccountModal(props) {
  const {
    onHide,
    show,
    handleCreate,
    onChangeImage,
    handleChange,
    form,
    setForm,
  } = props;
  const [isaddressModal, setisaddressModal] = useState(false);
  const [isPlaceOfOriginModal, setisPlaceOfOriginModal] = useState(false);
  const [isPlaceOfResidentModel, setisPlaceOfResidentModel] = useState(false);
  const [button, setButton] = useState(false);
  return (
    <div>
      <Modal centered show={show} size="lg" onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">New HR</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            id="account-form"
            data-parsley-validate=""
            onSubmit={handleCreate}
          >
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput877"
                  className="form-label"
                >
                  Hr Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  id="exampleFormControlInput877"
                  placeholder="Explain what the Employee Name"
                  value={form?.fullName}
                  onChange={(e) => handleChange(e)}
                  required
                />
              </div>
              <div className="row g-3 mb-3">
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
                    name="citizenId"
                    placeholder="Explain what the Citizen ID"
                    value={form?.citizenId}
                    onChange={(e) => handleChange(e)}
                    required
                    data-parsley-length="12"
                  />
                  {form?.citizenId?.length != 12 && button ? (
                    <span className="text-danger">
                      Citizen ID is 12 character
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select
                    className="form-select"
                    name="sex"
                    value={form?.sex}
                    onChange={(e) => handleChange(e)}
                    required
                  >
                    <option></option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div className="mb-3" onClick={() => setisaddressModal(true)}>
                <label htmlFor="formFileMultipleoneone" className="form-label">
                  Address
                </label>
                <input
                  className="form-control"
                  type="text"
                  readOnly
                  value={form?.currentAddress}
                  id="depone"
                  name="currentAddress"
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formFileMultipleoneone" className="form-label">
                  Image
                </label>
                <input
                  className="form-control"
                  type="file"
                  id="formFileMultipleoneone"
                  name="profileImage"
                  onChange={(e) => onChangeImage(e)}
                />
              </div>
              <div className="deadline-form">
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
                      placeholder="Email"
                      name="email"
                      value={form?.email}
                      onChange={(e) => handleChange(e)}
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
                      onChange={(e) => handleChange(e)}
                      required
                      data-parsley-length="[7,13]"
                    />
                    {!form?.phone?.startsWith("0") && button ? (
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
                      placeholder="Date of birth"
                      name="dateOfBirth"
                      value={form?.dateOfBirth}
                      onChange={(e) => handleChange(e)}
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
                      id="exampleFormControlInput477"
                      name="nationality"
                      value={form?.nationality}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3" onClick={() => setisPlaceOfOriginModal(true)}>
                <label htmlFor="formFileMultipleoneone" className="form-label">
                  Place Of Origin
                </label>
                <input
                  className="form-control"
                  type="text"
                  readOnly
                  value={form?.placeOfOrigrin}
                  id="depone"
                  name="placeOfOrigrin"
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mb-3" onClick={() => setisPlaceOfResidentModel(true)}>
                <label htmlFor="formFileMultipleoneone" className="form-label">
                  Place Of Resident
                </label>
                <input
                  className="form-control"
                  type="text"
                  readOnly
                  value={form?.placeOfResidence}
                  id="depone"
                  name="placeOfResidence"
                  onChange={(e) => handleChange(e)}
                />
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
                      id="exampleFormControlInput477"
                      name="dateOfIssue"
                      value={form?.dateOfIssue}
                      onChange={(e) => handleChange(e)}
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
                      id="exampleFormControlInput477"
                      name="issuedBy"
                      value={form?.issuedBy}
                      onChange={(e) => handleChange(e)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            form="account-form"
            className="btn btn-primary"
            onClick={() => {
              setButton(true);
            }}
          >
            Sent
          </button>
        </Modal.Footer>
      </Modal>
      <AddressModal
        show={isaddressModal}
        onClose={() => setisaddressModal(false)}
        editModeldata={form?.currentAddress}
        setaddressReturn={(e) => setForm({ ...form, currentAddress: e })}
      ></AddressModal>
      <AddressModal
        show={isPlaceOfOriginModal}
        onClose={() => setisPlaceOfOriginModal(false)}
        editModeldata={form?.placeOfOrigrin}
        setaddressReturn={(e) => setForm({ ...form, placeOfOrigrin: e })}
      ></AddressModal>
      <AddressModal
        show={isPlaceOfResidentModel}
        onClose={() => setisPlaceOfResidentModel(false)}
        editModeldata={form?.placeOfResidence}
        setaddressReturn={(e) => setForm({ ...form, placeOfResidence: e })}
      ></AddressModal>
    </div>
  );
}
export default HrAccountModal;
