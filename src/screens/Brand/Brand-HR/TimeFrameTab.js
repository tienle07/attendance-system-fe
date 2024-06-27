import React, { useEffect, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GrowingSpinner from "../../../components/UI/GrowingSpinner";
import { loginSuccess } from "../../../redux/auth/authSlice";
import { createAxios } from "../../../createInstance";
import { getAllBrandTimeFrame } from "../../../redux/brand/brandApi";
import BrandTimeFrame from "../brandTimeFrame";
import { toast } from "react-toastify";
import TimeFrameModal from "../TimeFrameModal";
import ConfigBrandCard from "./ConfigBrandCard";
function TimeFrameTab(props) {
  const { tab } = props;
  const brandid = localStorage.getItem("brand");
  const [loading, setLoading] = useState(false);
  const [isEditTimeFrame, setIsEditTimeFrame] = useState(false);
  const [isTimeFrameModal, setIsTimeFrameModal] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [timeframeform, setTimeFrameForm] = useState({});
  const [editModeldata, setEditModeldata] = useState("");
  const [button, setButton] = useState(false);
  const [pending, setPending] = useState(false);

  const user = useSelector((state) => state.auth?.login?.currentUser);
  const timeframe = useSelector((state) => state.brand?.timeFrame?.frame);
  const dispatch = useDispatch();
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (user?.data?.token?.accessToken) {
      getAllBrandTimeFrame(
        brandid,
        user?.data?.token?.accessToken,
        dispatch,
        axiosJWT
      );
    }
  }, [reducerValue]);
  const handleChangeTimeFrame = (e) => {
    setTimeFrameForm({ ...timeframeform, [e.target.name]: e.target.value });
  };
  const handleEditTimeFrameClick = async (timeframeid) => {
    try {
      const response = await axiosJWT.get(`/api/timeframe/` + timeframeid, {
        headers: {
          Authorization: `Bearer ${user?.data?.token?.accessToken}`,
        },
      });
      setTimeFrameForm(response.data.data);
      setIsEditTimeFrame(true);
      setEditModeldata(response.data.data);
      setIsTimeFrameModal(true);
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleCreateTimeFrame = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const res = await axiosJWT.post("/api/timeframe", timeframeform, {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        });
        if (res.data.code >= 200 && res.data.code < 300) {
          setIsTimeFrameModal(false);
          setEditModeldata("");
          setIsEditTimeFrame(false);
          toast.success("Create Time Frame Success");
          foreUpdate();
        }
      } catch (err) {
        toast.error("" + err?.response?.data?.message);
      }
    }
  };
  const handleEditTimeFrame = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        const res = await axiosJWT.put(
          "/api/timeframe/update-time-frame-infor/" + timeframeform.id,
          timeframeform,
          {
            headers: {
              Authorization: `Bearer ${user?.data?.token?.accessToken}`,
            },
          }
        );
        if (res.data.code >= 200 && res.data.code < 300) {
          setIsTimeFrameModal(false);
          setEditModeldata("");
          setIsEditTimeFrame(false);
          toast.success("Edit Time Frame Success");
          foreUpdate();
        }
      } catch (err) {
        toast.error("" + err?.response?.data?.message);
      }
    }
  };
  return (
    <div className="card card-chat-body border-0 order-1 w-100 px-4 px-md-5 py-3 py-md-4">
      {loading && <GrowingSpinner></GrowingSpinner>}
      {!loading && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-md-12">
              <div className="row g-3 mb-3">
                <div className="col-lg-6 col-md-6">
                  <BrandTimeFrame
                    list={timeframe}
                    onClickAdd={() => {
                      setIsEditTimeFrame(false);
                      setIsTimeFrameModal(true);
                    }}
                    handleEditClick={handleEditTimeFrameClick}
                    // data={positionList}
                    // title="Position Of Employee"
                    // onClickAdd={() => setisCreatePositionModel(true)}
                    // onClickDelete={(id) => { setisDeletePositionModel(true); setIdForEdit(id) }}
                  />
                </div>
                <div className="col-lg-6 col-md-6">
                  <ConfigBrandCard></ConfigBrandCard>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <TimeFrameModal
        onHide={() => {
          setIsTimeFrameModal(false);
          setTimeFrameForm([]);
          setEditModeldata([]);
          setButton(false);
        }}
        isModal={isTimeFrameModal}
        isFetching={pending}
        form={timeframeform}
        isEdit={isEditTimeFrame}
        handleEdit={handleEditTimeFrame}
        handleCreate={handleCreateTimeFrame}
        handleChange={handleChangeTimeFrame}
        button={button}
        foreUpdate={foreUpdate}
        setButton={setButton}
        setIsModal={setIsTimeFrameModal}
        setIsValid={setIsFormValid}
      ></TimeFrameModal>
    </div>
  );
}

export default TimeFrameTab;
