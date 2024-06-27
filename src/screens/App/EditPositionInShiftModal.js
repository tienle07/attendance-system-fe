import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { useState } from "react";
import { toast } from "react-toastify";
import { loginSuccess } from "../../redux/auth/authSlice";
import { createAxios } from "../../createInstance";

function EditPositionInShiftModal(props) {
  const { show, onHide, isFetching, foreUpdate,setIsEditPositionInShiftModal,isEditPositionInShiftModal } = props;

  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  )?.filter((pos) => pos.active === true && pos.name !== "Store Manager");
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const shiftPosition = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.shiftPositions
  );
  const curShift = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.workShift
  );
  const [form, setForm] = useState([]);
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user,dispatch,loginSuccess)
  useEffect(() => {
    setForm(shiftPosition);
  }, [curShift?.id,isEditPositionInShiftModal]);
  const getPositionNameById = (id) => {
    const positionObj = positionList?.find((x) => x.id === id);

    return positionObj?.name;
  };
  const changeQuantity = (e, index) => {
    const updatedForm = [...form];

    updatedForm[index] = {
      ...updatedForm[index],
      [e.target.name]: e.target.value,
    };
    setForm(updatedForm);
  };
  const handleEditShiftPosition = async(e) => {
    e.preventDefault();
    const formEdit = form?.filter((f)=>f.quantity !== 0).map((edit) =>{
      return {
         id: edit.id,
         positionId: edit.positionId,
         quantity: edit.quantity
      }
    })
    try {
      const res = await axiosJWT.put(
        "/api/shiftposition/manager-update-shift-position/" + curShift?.id,
        formEdit,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Update Position Success");
        setIsEditPositionInShiftModal(false);
        foreUpdate();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  return (
    <>
      <Modal centered show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Shift Position</Modal.Title>
        </Modal.Header>
        {isFetching && <GrowingSpinner></GrowingSpinner>}
        {!isFetching && (
          <Modal.Body>
            <form data-parsley-validate="" onSubmit={handleEditShiftPosition}>
              <div className="row g-3 mb-3">
                {form?.map((position, index) => (
                  <div key={"jkkf" + index} className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label
                        htmlFor="deptwo"
                        className="form-label"
                        hidden={position.quantity === 0}
                      >
                        Position
                      </label>
                      {position.quantity !== 0 && (
                        <input
                          disabled
                          className="form-control"
                          value={getPositionNameById(position?.positionId)}
                        ></input>
                      )}
                    </div>
                    <div className="col-sm-6 ">
                      <label
                        htmlFor="depone"
                        className="form-label"
                        hidden={position.quantity === 0}
                      >
                        Quantity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="depone"
                        min={1}
                        step={1}
                        hidden={position?.quantity === 0}
                        name="quantity"
                        value={position?.quantity}
                        onChange={(e) => changeQuantity(e, index)}
                        required
                      />
                    </div>
                  </div>
                ))}
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

export default EditPositionInShiftModal;
