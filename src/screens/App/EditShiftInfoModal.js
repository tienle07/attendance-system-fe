import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import Select from "react-select";
import { useState } from "react";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";

function EditShiftInfoModal(props) {
  const {
    id,
    setIsEditShiftInfoModal,
    data,
    show,
    onHide,
    isFetching,
    foreUpdate,
  } = props;
  const shift = useSelector(
    (state) => state.workschedule?.workshift?.shift?.workSheduleResponses
  );
  const timeframe = useSelector((state) => state.brand?.timeFrame?.frame);
  let listTimeframeForSelect = timeframe?.map((d) => {
    return {
      value: d.id,
      label: d.name,
    };
  });
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const [dayList, setDayList] = useState([]);
  const [timeFrameList, setTimeFrameList] = useState([]);
  const [timeFrameId, setTimeFrameId] = useState('');
  const [frame, SetFrame] = useState({});
  const [day, setDay] = useState([]);
  const [form, setForm] = useState([]);
  const [addStartTime, setAddStartTime] = useState("");
  const [addEndTime, setAddEndTime] = useState("");
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    setForm(data);
    getListDay();
    getListTimeFrame();
  }, [data?.id]);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChangeCheck = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };
  const getListDay = () => {
    let list = [];
    for (let i = 0; i < 7; i++) {
      list = list.concat({
        label: moment(shift?.startDate)
          .add(i, "days")
          .format("dddd DD-MM-YYYY"),
        value: moment(shift?.startDate).add(i, "days").format("YYYY-MM-DD"),
      });
    }
    setDayList(list);
    const date = {
      label: moment(data?.startTime).format("dddd DD-MM-YYYY"),
      value: moment(data?.startTime).format("YYYY-MM-DD"),
    };
    setDay(date);
    setAddStartTime(moment(data?.startTime).format("HH:mm"));
    setAddEndTime(moment(data?.endTime).format("HH:mm"));
  };
  const getListTimeFrame = () => {
    const listTimeframeForSelect = timeframe?.map((d) => {
      return {
        value: d.id,
        label: d.name,
      };
    });
    setTimeFrameList(listTimeframeForSelect);
    setTimeFrameId(form?.timeFrameId);
    const frame = {
      label: form?.timeFrameName,
      value: form?.timeFrameId,
    };
    SetFrame(frame);
  };
  const handleEditShiftInfo = async (e) => {
    e.preventDefault();
    let addStartTimeSlice = addStartTime.slice(0, 2);
    let addEndTimeSlice = addEndTime.slice(0, 2);
    let startime;
    let endtime;
    const list = () => {
      if (Number(addEndTimeSlice) <= Number(addStartTimeSlice)) {
        startime = day.value + "T" + addStartTime;
        endtime = moment(day.value + "T" + addEndTime)
          .add(1, "days")
          .format("YYYY-MM-DDTHH:mm");
      } else {
        startime = day.value + "T" + addStartTime;
        endtime = day.value + "T" + addEndTime;
      }
      return {
        shiftName: form?.shiftName,
        startTime: startime,
        endTime: endtime,
        timeFrameId: frame?.value,
        isSplitShift: form?.isSplitShift,
      };
    };
    const edit = list();
    try {
      const res = await axiosJWT.put(
        "api/workshift/manager-update-shift/" + data?.id,
        edit,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        setIsEditShiftInfoModal(false);
        toast.success("Update Shift Success");
        foreUpdate();
      }
      if (res.data.code === 400) {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Shift Information</Modal.Title>
        </Modal.Header>
        {isFetching && <GrowingSpinner></GrowingSpinner>}
        {!isFetching && (
          <Modal.Body>
            <form data-parsley-validate="" onSubmit={handleEditShiftInfo}>
              <div className="row g-3 mb-3">
                <div className="col-sm-9">
                  <label htmlFor="depone" className="form-label">
                    Shift Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="shiftName"
                    value={form?.shiftName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-sm-3">
                  <div className="form-group">
                    <label className="form-label">Split Shift</label>
                    <br />
                    <label className="control-inline fancy-checkbox justify-content-center align-items-center">
                      <input
                        type="checkbox"
                        className="custom-checkbox"
                        name="isSplitShift"
                        defaultChecked={form?.isSplitShift}
                        onChange={handleChangeCheck}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="depone" className="form-label">
                    Date
                  </label>
                  <Select
                    options={dayList}
                    value={day}
                    onChange={(e) => {
                      setDay(e);
                    }}
                  ></Select>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="depone" className="form-label">
                    Time Frame
                  </label>
                  <Select
                    options={listTimeframeForSelect}
                    value={frame}
                    onChange={(e) => {
                      SetFrame(e);
                    }}
                  ></Select>
                </div>
              </div>

              <div className="deadline-form">
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="depone" className="form-label">
                      Start Time
                    </label>
                    <input
                      type="time"
                      step="1800"
                      className="form-control"
                      id="timepickerded29"
                      value={addStartTime}
                      onChange={(e) => setAddStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="deptwo" className="form-label">
                      End Time
                    </label>
                    <input
                      type="time"
                      step="1800"
                      className="form-control"
                      id="timepickerded29"
                      value={addEndTime}
                      onChange={(e) => setAddEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex flex-row-reverse">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
}

export default EditShiftInfoModal;
