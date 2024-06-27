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
import { useNavigate } from "react-router-dom";

function AddNewPositionModal(props) {
  const {
    show,
    onHide,
    isFetching,
    foreUpdate,
    setIsAddNewPositionModal,
    fore,
    isAddNewPositionModal,
  } = props;

  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  )?.filter((pos) => pos.active === true && pos.id !== 1);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const shiftPosition = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.shiftPositions
  );
  const curShift = useSelector(
    (state) => state.workschedule?.workshift?.curshift?.workShift
  );
  const [form, setForm] = useState([]);
  const [listPositionForSelect, setListPositionForSelect] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    getListPositionNotSelected();
    setForm([]);
  }, [curShift?.id, fore, isAddNewPositionModal]);
  const getListPositionNotSelected = () => {
    let list = [...positionList];
    shiftPosition?.map((pos) => {
      list = list?.filter((position) => position.id !== pos.positionId);
    });
    let listForSelect = list
      .filter((position) => position.name !== 'Store Manager')
      .map((pos) => {
        return {
          value: pos.id,
          label: pos.name,
        };
      });
    const position = shiftPosition?.filter((pos) => pos.quantity === 0);

    position?.map((pos) => {
      listForSelect = listForSelect.concat({
        value: pos.positionId,
        label: getPositionNameById(pos.positionId),
      });
    });
    setListPositionForSelect(listForSelect);
  };
  const getPositionNameById = (id) => {
    const positionObj = positionList?.find((x) => x.id === id);

    return positionObj?.name;
  };
  const changeQuantity = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };
  const changePosition = (e) => {
    const position = shiftPosition.filter((pos) => pos.positionId === e.value);
    if (position?.length > 0) {
      setForm((prev) => {
        return { ...prev, ["id"]: position[0]?.id };
      });
    }
    setForm((prev) => {
      return { ...prev, ["positionId"]: e.value };
    });
  };
  const handleAddNewShiftPosition = async (e) => {
    e.preventDefault();
    if (form?.id) {
      try {
        const res = await axiosJWT.put(
          "/api/shiftposition/manager-update-shift-position/" + curShift?.id,
          [form],
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );

        if (res.data.code >= 200 && res.data.code < 300) {
          toast.success("Add Position Success");
          setIsAddNewPositionModal(false);
          foreUpdate();
        }
      } catch (err) {
        toast.error(err?.response?.data?.message);
      }
      return;
    }
    try {
      const res = await axiosJWT.post(
        "/api/shiftposition/manager-add-shift-position/" + curShift?.id,
        form,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Add Position Success");
        setIsAddNewPositionModal(false);
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
          <Modal.Title className="fw-bold">Add New Shift Position</Modal.Title>
        </Modal.Header>
        {isFetching && <GrowingSpinner></GrowingSpinner>}
        {!isFetching && (
          <Modal.Body>
            <form data-parsley-validate="" onSubmit={handleAddNewShiftPosition}>
              <div className="row g-3 mb-3">
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="deptwo" className="form-label">
                      Position
                    </label>
                    <Select
                      options={listPositionForSelect}
                      onChange={(e) => changePosition(e)}
                      hideSelectedOptions={true}
                    ></Select>
                  </div>
                  <div className="col-sm-6 ">
                    <label htmlFor="depone" className="form-label">
                      Quantity
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="depone"
                      name="quantity"
                      value={form?.quantity}
                      onChange={(e) => changeQuantity(e)}
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

export default AddNewPositionModal;
