import { Modal } from "react-bootstrap";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/auth/authSlice";
import { createAxios } from "../../createInstance";
import { toast } from "react-toastify";
import { useState } from "react";

function TimeFrameModal(props) {
  const {
    onHide,
    isModal,
    setIsModal,
    isFetching,
    handleEdit,
    handleCreate,
    handleChange,
    isEdit,
    form,
    button,
    foreUpdate,
    setButton,
    setIsValid,
  } = props;
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const timeframe = useSelector((state) => state.brand?.timeFrame?.frame);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  const handleDelete = async(id) => {
    try {
      const res = await axiosJWT.put(
        "/api/timeframe/remove-time-frame/" + id,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setIsDeleteModal(false);
        toast.success("Delete Time Frame Success");
        foreUpdate();
      }
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  }
  const checkFormValid=(data)=>{
    const check = regex.test(data) ?  true : false;
    console.log(check);
    return setIsValid(check)
  }
  return (
    <div>
      <Modal centered show={isModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {isEdit ? "Edit Time Frame" : "Create New Time Frame"}
          </Modal.Title>
        </Modal.Header>
        {isFetching && <GrowingSpinner></GrowingSpinner>}
        {!isFetching && (
          <Modal.Body>
            <form
              data-parsley-validate=""
              onSubmit={isEdit ? handleEdit : handleCreate}
            >
              <div className="row g-3 mb-3">
                <div className="mb-3">
                  <label htmlFor="depone" className="form-label">
                    Time Frame Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="depone"
                    name="name"
                    value={form?.name}
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                    Coefficient Salary
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="deptwo"
                    min="0"
                    value={form?.coefficientSalary}
                    name="coefficientSalary"
                    onChange={(e) => handleChange(e)}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                    Minimum Duration
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="deptwo"
                    value={form?.minimumDuration}
                    name="minimumDuration"
                    onChange={(e) => {handleChange(e);checkFormValid(e.target.value)}}
                    maxLength="8"
                    placeholder="HH:MM:SS"
                    required
                  />
                  {!regex.test(form?.minimumDuration) && button ? (
                    <span className="text-danger">
                      Correct Format: HH:MM:SS
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="deadline-form">
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="depone" className="form-label">
                      Come Late Expand
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="depone"
                      value={form?.comeLateExpand}
                      name="comeLateExpand"
                      onChange={(e) => {handleChange(e);checkFormValid(e.target.value)}}
                      placeholder="HH:MM:SS"
                      maxLength="8"
                      required
                    />
                    {!regex.test(form?.comeLateExpand) && button ? (
                      <span className="text-danger">
                        Correct Format: HH:MM:SS
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="deptwo" className="form-label">
                      Leave Early Expand
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="deptwo"
                      value={form?.leaveEarlyExpand}
                      name="leaveEarlyExpand"
                      onChange={(e) => {handleChange(e);checkFormValid(e.target.value)}}
                      maxLength="8"
                      placeholder="HH:MM:SS"
                      required
                    />
                    {!regex.test(form?.leaveEarlyExpand) && button ? (
                      <span className="text-danger">
                        Correct Format: HH:MM:SS
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="depone" className="form-label">
                      CheckIn Expand
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="depone"
                      value={form?.checkInExpand}
                      name="checkInExpand"
                      onChange={(e) => {handleChange(e);checkFormValid(e.target.value)}}
                      maxLength="8"
                      placeholder="HH:MM:SS"
                      required
                    />
                    {!regex.test(form?.checkInExpand) && button ? (
                      <span className="text-danger">
                        Correct Format: HH:MM:SS
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="deptwo" className="form-label">
                      CheckOut Expand
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="deptwo"
                      value={form?.checkOutExpand}
                      name="checkOutExpand"
                      onChange={(e) => {handleChange(e);checkFormValid(e.target.value)}}
                      maxLength="8"
                      placeholder="HH:MM:SS"
                      required
                    />
                    {!regex.test(form?.checkOutExpand) && button ? (
                      <span className="text-danger">
                        Correct Format: HH:MM:SS
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row-reverse">
                <div className="btn btn-group">
                  {isEdit ? (
                    <button
                      type="button"
                      hidden={timeframe?.length < 2}
                      className="btn btn-danger"
                      onClick={() => setIsDeleteModal(true)}
                    >
                      Delete
                    </button>
                  ) : (
                    ""
                  )}

                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={() => setButton(true)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </Modal.Body>
        )}
      </Modal>
      <Modal
            show={isDeleteModal}
            centered
            onHide={() => {
              setIsDeleteModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Delete Time Frame</Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                Are you sure to delete this time frame?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger color-fff"
                onClick={() => {
                  handleDelete(form?.id);
                }}
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal>
    </div>
  );
}
export default TimeFrameModal;
