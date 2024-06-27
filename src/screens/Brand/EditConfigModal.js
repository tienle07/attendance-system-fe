import { Modal } from "react-bootstrap";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/auth/authSlice";
import { createAxios } from "../../createInstance";
import { toast } from "react-toastify";
import { useState } from "react";

function EditConfigModal(props) {
  const {
    config,
    onHide,
    show,
    foreUpdate
  } = props;
  const [form, setForm] = useState(config);
  const [isFetching, setIsFetching] = useState(false);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  const handleChange = (name,value) => {
    setForm({ ...form, [name]: value });
  };
  const convertHoursToticks = (hours) => {
    const ticks = hours * 60 * 60 * 1000 * 10000;
    return ticks;
  };
  const convertticksToHours = (ticks) => {
    const hours = ticks / (60 * 60 * 1000 * 10000);
    return hours;
  };
  const handleEditConfig = async (e) => {
    e.preventDefault();
    const edit ={
        maximumShiftDuration: convertHoursToticks(form?.maximumShiftDuration),
        shiftModifiableTime: convertHoursToticks(form?.shiftModifiableTime),
        maximumLeaveRequest: convertHoursToticks(form?.maximumLeaveRequest),
        leaveRequestableTime: convertHoursToticks(form?.leaveRequestableTime),
        attendanceModifiableTime: convertHoursToticks(form?.attendanceModifiableTime),
        attendanceAcceptableRange: form?.attendanceAcceptableRange
    }
      try {
        const res = await axiosJWT.put(
          "api/brandconfiguration/update-brand-configuration/" + config?.id,
          form,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        if (res.data.code >= 200 && res.data.code < 300) {
          toast.success("Edit Brand Config Success");
          onHide();
          foreUpdate();
        }   
      } catch (err) {
        toast.error("" + err?.response?.data?.message);
      }
  };
  const onHideModal =() =>{
    setForm(config);
    onHide();
  }
  return (
    <div>
      <Modal centered show={show} onHide={onHideModal}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            Edit Brand Config
          </Modal.Title>
        </Modal.Header>
        {isFetching && <GrowingSpinner></GrowingSpinner>}
        {!isFetching && (
          <Modal.Body>
            <form
              data-parsley-validate=""
              onSubmit={(e)=>handleEditConfig(e)}
            >
              <div className="row g-3 mb-3">
                <div className="mb-3">
                  <label htmlFor="depone" className="form-label">
                  Shift Duration (hours)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="depone"
                    name="maximumShiftDuration"
                    value={convertticksToHours(form?.maximumShiftDuration)}
                    onChange={(e) => handleChange(e.target.name,convertHoursToticks(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                  Shift Modifiable Time (hours)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="deptwo"
                    min="0"
                    value={convertticksToHours(form?.shiftModifiableTime)}
                    name="shiftModifiableTime"
                    placeholder="Hours"
                    onChange={(e) => handleChange(e.target.name,convertHoursToticks(e.target.value))}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                  Leave Requestable Time (hours)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="deptwo"
                    placeholder="Hours"
                    value={convertticksToHours(form?.leaveRequestableTime)}
                    name="leaveRequestableTime"
                    onChange={(e) => {handleChange(e.target.name,convertHoursToticks(e.target.value))}}
                    required
                  />
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                  Attendance Modifiable Time (hours)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="deptwo"
                    placeholder="Hours"
                    min="0"
                    value={convertticksToHours(form?.attendanceModifiableTime)}
                    name="attendanceModifiableTime"
                    onChange={(e) => handleChange(e.target.name,convertHoursToticks(e.target.value))}
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="deptwo" className="form-label">
                  Attendance Acceptable Range (meter)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="deptwo"
                    placeholder="Meter"
                    min="0"
                    value={form?.attendanceAcceptableRange}
                    name="attendanceAcceptableRange"
                    onChange={(e) => {handleChange(e.target.name,e.target.value)}}
                    required
                  />
                </div>
              </div>
              <div className="d-flex flex-row-reverse">
                <div className="btn btn-group">
                  <button
                    type="submit"
                    className="btn btn-success"
                    // onClick={() => setButton(true)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </Modal.Body>
        )}
      </Modal>
    </div>
  );
}
export default EditConfigModal;
