import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { loginSuccess } from "../../redux/auth/authSlice";
import { createAxios } from "../../createInstance";
import { getWorkScheduleTemplate } from "../../redux/workschedule/workscheduleApi";

function SelectTemplateModal(props) {
  const { show, onHide, foreUpdate,id } = props;
  const storeid = localStorage.getItem("storeid");
  const [templateListForSelect, setTemplateListForSelect] = useState([]);
  const [posListToSelect, setPosListToSelect] = useState([]);
  const [loading, setLoading] = useState("");
  const [template, setTemplate] = useState("");
  const [inStoreId, setInStoreId] = useState("");
  const [employeePositionId, setEmployeePositionId] = useState("");
  const [workShifts, setWorkShifts] = useState([]);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const workSchedule = useSelector(
    (state) => state.workschedule?.workscheduletemplate?.template
  );
  const templateList = useSelector((state) => state.auth?.login?.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }if(localStorage.getItem('role')  === '3'){
      getTemplateListForSelect()
    }
  }, [id]);
  const getTemplateListForSelect = async() => {
    setLoading(true);
    try {
        const res = await axiosJWT.get(
          `/api/workschedule/manager-get-schedules-in-store?StoreId=${storeid}&IsTemplate=true`,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
       const list =(res.data.data).map((d)=>{
          return {
            value: d.id,
            label: `Week ${d.weekNumber} - ${moment(d.startDate).format('MMM Do YYYY')} - ${moment(d.endDate).format('MMM Do YYYY')}`,
          }
       })
       setTemplateListForSelect(list)
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
};
  const handleAssign = async (e) => {
    e.preventDefault();
    const templateresponse = {
        storeId: storeid,
        fromScheduleId: template,
        toScheduleId: id
    }
    try {
        const res = await axiosJWT.put(
          `/api/workschedule/manager-clone-schedule-from-template`,templateresponse,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        const newStatus = {
          employeeInStoreId: inStoreId,
          storeId: storeid,
          status: 2,
        };
        onHide()
        toast.success("Generate Success");
        foreUpdate();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title
          className="fw-bold"
          id="example-custom-modal-styling-title"
        >
          Choose Tempalte To Generate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row g-3 mb-3">
          <form data-parsley-validate="" onSubmit={handleAssign}>
            <div className="mb-3">
              <label htmlFor="depone" className="form-label">
                Template
              </label>
              <Select
                options={templateListForSelect}
                onChange={(e) => {
                  setTemplate(e.value);
                }}
              ></Select>
            </div>
            <div className="d-flex flex-row-reverse">
              <button type="submit" className="btn btn-primary">
                Generate
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default SelectTemplateModal;
