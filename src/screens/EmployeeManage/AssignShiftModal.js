import moment from "moment";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { createAxios } from "../../createInstance";
import { loginSuccess } from "../../redux/auth/authSlice";


function AssignShiftModal(props) {
  const { show, onHide, setIsAssignShiftModal,foreUpdate,isAssignShiftModal,employee } = props;
  const storeid = localStorage.getItem('storeid');
  const [employeeListForSelect, setEmployeeListForSelect] = useState([]);
  const [posListToSelect, setPosListToSelect] = useState([]);
  const [loading, setLoading] = useState("");
  const [inStoreId, setInStoreId] = useState("");
  const [employeePositionId, setEmployeePositionId] = useState("");
  const [workShifts, setWorkShifts] = useState([]);

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const employeeList = useSelector(
    (state) =>
      state?.branchs?.currentBranchSelect?.curBranch
        ?.employeeInStoreResponseModels
  )?.filter((e) => e.positionName !== "Store Manager" && e.status !== -1);
  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  )?.filter((pos) => pos.active === true && pos.name !== "Store Manager");
  const shift = useSelector(
    (state) => state.workschedule?.workshift?.shift?.workShiftResponses
  );
  const workSchedule = useSelector(
    (state) => state.workschedule?.workshift?.shift?.workSheduleResponses
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    getPositionListForSelect();
  }, [employee,isAssignShiftModal]);
  const getPositionNameById = (id) => {
    const positionObj = positionList?.find((x) => x.id == id);
    return positionObj?.name;
  };
  const getPositionListForSelect = async() => {
      setLoading(true);
      try {
        if (employee?.employeeId) {
          const res = await axiosJWT.get(
            `/api/workshift/get-employee-available-shifts?EmployeeId=${employee?.employeeId}&StoreId=${storeid}`,
            {
              headers: {
                Authorization: `Bearer ${user?.data?.token?.accessToken}`,
              },
            }
          );
         const list =(res.data.data).map((shift)=>{
            return {
              label: moment(shift?.workShift?.startTime).format("ddd MMM Do")  + ' - ' + shift?.workShift?.shiftName + ' - ' + shift?.shiftPositions[0]?.available +" Slot " + getPositionNameById(shift?.shiftPositions[0]?.positionId) + " Available",
              value: shift?.shiftPositions[0]?.shiftId
            }
         })
         setPosListToSelect(list)
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
  };
  const handlePostStatus = async(newStatus) =>{
    try {
      const res = await axiosJWT.put(
        "/api/employeeinstore/store-manager-update-employee-in-store-status",
        newStatus,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );
    } catch (err) {
      toast.error("" + err?.response?.data?.message);
    }
  }
  const handleAssign = async(e)=>{
    e.preventDefault();
    const list = workShifts.map((shift)=>{
      return shift.value
    })
    const shift ={
      employeeId: employee?.employeeId,
      storeId: workSchedule?.storeId,
      workShifts: list
    }
    try {
      if (employee?.employeeId) {
        const res = await axiosJWT.post(
          `/api/employeeshift/manager-assign-shift`,shift,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        const newStatus ={
          employeeInStoreId: employee?.id,
          storeId: storeid,
          status: 2
        }
        handlePostStatus(newStatus)
        toast.success("Assign Shift Success");
        setIsAssignShiftModal(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  }
  const handleClose = () => {
    setPosListToSelect([])
    // setEmployeeId('')
    setIsAssignShiftModal(false)
  }
  return (
    <Modal show={show} onHide={handleClose}  centered>
      <Modal.Header closeButton>
        <Modal.Title
          className="fw-bold"
          id="example-custom-modal-styling-title"
        >
          Assign Shift
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="row g-3 mb-3">

          <form data-parsley-validate="" onSubmit={handleAssign}>
              <div className="mb-3">
                <label htmlFor="deptwo" className="form-label">
                  Shift Available
                </label>
                <Select
                isLoading={loading}
                  options={posListToSelect}
                  isMulti
                  isClearable
                  closeMenuOnSelect={false}
                  // defaultValue={moment(addStartDate).format('YYYY-MM-DD')}
                //   value={workShifts}
                  onChange={(e) => {
                    setWorkShifts(e);
                  }}
                ></Select>
              </div>
            <div className="d-flex flex-row-reverse">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>

    </Modal>
  );
}

export default AssignShiftModal;
