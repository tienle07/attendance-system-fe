import React, { useReducer } from "react";
import PageHeader from "../../components/common/PageHeader";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getWorkShift } from "../../redux/workschedule/workscheduleApi";
import GrowingSpinner from "../../components/UI/GrowingSpinner";
import { useState } from "react";
import { Dropdown, Modal, Popover } from "react-bootstrap";
import { getEmployeePosition } from "../../redux/employee/employeeApi";
import moment from "moment";
import { toast } from "react-toastify";
import Select from "react-select";
import ShiftDetailsModal from "./ShiftDetailsModal";
import AssignShiftModal from "./AssignShiftModal";
import { getAllBrandTimeFrame } from "../../redux/brand/brandApi";
import { loginSuccess } from "../../redux/auth/authSlice";
import { createAxios } from "../../createInstance";
import SetAsTemPlateModal from "./SetAsTemPlateModal";
import SelectTemplateModal from "./SelectTemplateModal";

function Calendar(props) {
  const data = useSelector(
    (state) => state.workschedule?.workshift?.shift?.workShiftResponses
  );
  const schedule = useSelector(
    (state) => state.workschedule?.workshift?.shift?.workSheduleResponses
  );
  const allSchedule = useSelector(
    (state) => state.workschedule?.workschedule?.schedule
  );
  const positionList = useSelector(
    (state) => state.employees?.employeePosition?.position
  );
  const timeframe = useSelector((state) => state.brand?.timeFrame?.frame);

  const [isModal, setIsModal] = useState(false);
  const [isTemplateModal, setIsTemplateModal] = useState(false);
  const [isSetTemplateModal, setIsSetTemplateModal] = useState(false);
  const [isEditModalData, setIsEditModalData] = useState("");
  const [isShiftDetailsModal, setIsShiftDetailsModal] = useState(false);
  const [isAssignShiftModal, setIsAssignShiftModal] = useState(false);

  let [listShiftPositons, setListShiftPositons] = useState([
    {
      positionId: 0,
      quantity: 1,
    },
  ]);
  let listPotision = positionList
    ?.filter((item) => item.name !== "Store Manager")
    ?.map((d, i) => {
      return {
        value: d.id,
        label: d.name,
      };
    });
  const [dayList, setDayList] = useState([]);
  const [listDayToAdd, setListDayToAdd] = useState([]);
  const [selectedOption, setSelectedOption] = useState(
    positionList
      ?.filter((item) => item.name !== "Store Manager" && item.active)
      ?.map((d) => {
        return {
          value: d.id,
          label: d.name,
        };
      })
  );
  const [selectedOptionOnEventClick, setSelectedOptionOnEventClick] = useState(
    positionList
      ?.filter((item) => item.name !== "Store Manager" && item.active)
      .map((d, i) => {
        return {
          value: d.id,
          label: d.name,
        };
      })
  );
  const [shiftIdForEdit, setshiftIdForEdit] = useState("");
  const [addStartTime, setAddStartTime] = useState("");
  const [addEndTime, setAddEndTime] = useState("");
  const [shiftName, setShiftName] = useState("");
  const [frameId, setFrameId] = useState("");
  const [isSplitShift, setisSplitShift] = useState(false);
  const [listPositionForEdit, setlistPositionForEdit] = useState(listPotision);

  const { id } = useParams("id");
  const shift = useSelector((state) => state.workschedule?.workshift?.shift);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const isLoading = useSelector(
    (state) => state.workschedule?.workshift?.isFetching
  );
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  let eventsData = data
    ?.filter((shift) => shift.workShift?.status !== -1)
    ?.map((d, i) => {
      return {
        title: d?.workShift?.shiftName,
        start: d?.workShift?.startTime,
        end: d?.workShift?.endTime,
        color: `${
          d?.workShift?.isSplitShift
            ? "#f1c40f"
            : d?.workShift?.holidayId
            ? "#e74c3c"
            : "#EEE8AA"
        }`,
        extendedProps: {
          id: d?.workShift?.id,
          shiftPositions: d.shiftPositions,
          isSplitShift: d.isSplitShift,
          status: d?.workShift?.status,
        },
      };
    });
  let listTimeframeForSelect = timeframe?.map((d, i) => {
    return {
      value: d.id,
      label: d.name,
    };
  });
  let listScheduleForSelect = allSchedule?.map((d, i) => {
    return {
      value: d.id,
      label: "Week " + d.weekNumber,
    };
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    getAsync();
    eventsData = data
      ?.filter((shift) => shift.workShift?.status !== -1)
      ?.map((d) => {
        return {
          title: d.shiftName,
          start: d.startTime,
          end: d.endTime,
          extendedProps: {
            id: d.id,
            shiftPositions: d.shiftPositions,
          },
        };
      });
    listTimeframeForSelect = timeframe?.map((d, i) => {
      return {
        value: d.id,
        label: d.name,
      };
    });
    getListDay();
    console.log(eventsData);
  }, [reducerValue]);
  const getAsync = async () => {
    await getWorkShift(id, dispatch, user?.data?.token?.accessToken, axiosJWT);
    await getAllBrandTimeFrame(
      user?.data?.account?.brandId,
      user?.data?.token?.accessToken,
      dispatch,
      axiosJWT
    );
    await getEmployeePosition(
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT
    );
  };
  const getListDay = () => {
    let list = [];
    for (let i = 0; i < 7; i++) {
      list = list.concat({
        label: moment(shift?.workSheduleResponses?.startDate)
          .add(i, "days")
          .format("dddd DD-MM-YYYY"),
        value: moment(shift?.workSheduleResponses?.startDate)
          .add(i, "days")
          .format("YYYY-MM-DD"),
      });
    }
    setDayList(list);
  };
  const getPositionNameById = (id) => {
    const positionObj = positionList?.find((x) => x.id == id);

    return positionObj?.name;
  };
  const handleSelect = (info) => {
    if (localStorage.getItem("role") !== "3") {
      return;
    }
    const startTime = moment(info.startStr).format("HH:mm");
    const endTime = moment(info.endStr).format("HH:mm");
    const date = [
      {
        label: moment(info.startStr).format("dddd DD-MM-YYYY"),
        value: moment(info.startStr).format("YYYY-MM-DD"),
      },
    ];
    setListDayToAdd(date);
    setAddStartTime(startTime);
    setAddEndTime(endTime);
    setIsModal(true);
  };
  const changeStartDate = (e) => {
    setAddStartTime(e.target.value);
  };
  const changeEndDate = (e) => {
    setAddEndTime(e.target.value);
  };
  const handleCreate = async (e) => {
    if (localStorage.getItem("role") !== "3") {
      return;
    }
    e.preventDefault();
    let addStartTimeSlice = addStartTime.slice(0, 2);
    let addEndTimeSlice = addEndTime.slice(0, 2);
    let startime;
    let endtime;
    const list = listDayToAdd.map((day) => {
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
        shiftName: shiftName,
        startTime: startime,
        endTime: endtime,
        timeFrameId: frameId,
        isSplitShift: isSplitShift,
        ShiftPositions: listShiftPositons,
      };
    });
    const newShift = {
      scheduleId: id,
      WorkShifts: list,
    };
    try {
      const res = await axiosJWT.post(
        "api/workshift/manager-create-new-shift",
        newShift,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        setIsModal(false);
        setIsEditModalData(false);
        setListShiftPositons([{ positionId: 0, quantity: "" }]);
        setSelectedOption(
          positionList
            ?.filter((item) => item.name !== "Store Manager" && item.active)
            ?.map((d) => {
              return {
                value: d.id,
                label: d.name,
              };
            })
        );
        toast.success("Add New Shift Success");
        foreUpdate();
      }
      if (res.data.code === 400) {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const handleEventClick = (info) => {
    let listpotision = [];
    let listpotisionNotChange = [];
    let listSelected = [...selectedOption];
    let listpositionid = positionList?.filter(
      (item) => item.name !== "Store Manager" && item.active
    );
    const prop = info.event.extendedProps.shiftPositions;

    for (let x in prop) {
      listpotision = listpotision.concat(prop[x]);
      listpotisionNotChange = listpotision.concat(prop[x]);
    }
    listpotision = listpotision?.map((d, i) => {
      listpositionid = listpositionid.filter((x) => x?.id !== d.positionId);
      return {
        id: d.id,
        shiftId: d.shiftId,
        positionId: d.positionId,
        quantity: d.quantity,
      };
    });
    // (listpotisionNotChange.filter((x) => x?.quantity !== 2)).map((d, i) => {
    //     listpositionid.concat(positionList?.filter((item) => item.id === d.positionId))
    // })
    listSelected = listpositionid?.map((d, i) => {
      return {
        value: d.id,
        label: d.name,
      };
    });

    const date = [
      {
        label: moment(info.event.startStr).format("dddd DD-MM-YYYY"),
        value: moment(info.event.startStr).format("YYYY-MM-DD"),
      },
    ];
    // setlistPositionForEdit(listpositionid)
    setListDayToAdd(date);
    setListShiftPositons(listpotision);
    setShiftName(info.event.title);
    setAddStartTime(moment(info.event.startStr).format("HH:mm"));
    setAddEndTime(moment(info.event.endStr).format("HH:mm"));
    // setIsModal(true);
    // setIsEditModalData(true);
    setSelectedOption(listSelected);
    setSelectedOptionOnEventClick(listSelected);
    setshiftIdForEdit(info.event.extendedProps.id);
    setisSplitShift(info.event.extendedProps.isSplitShift);
    setIsShiftDetailsModal(true);
  };

  const handlePositionAdd = () => {
    setListShiftPositons([
      ...listShiftPositons,
      {
        positionId: 0,
        quantity: "",
      },
    ]);
  };
  const handlePostionRemove = (id, index) => {
    const list = [...listShiftPositons];
    let listSelected = [...selectedOption];
    listSelected = listSelected.concat(
      positionList
        .filter((pos) => pos.id === id && pos.active)
        ?.map((d, i) => {
          return {
            value: d.id,
            label: d.name,
          };
        })
    );
    list.splice(index, 1);
    setSelectedOption(listSelected);
    setListShiftPositons(list);
  };
  const changeQuantity = (e, index) => {
    let { name, value } = e.target;
    let listChangeQuantity = [...listShiftPositons];

    listChangeQuantity[index][name] = value;
    setListShiftPositons(listChangeQuantity);
  };
  const changePosition = (e, index) => {
    // const positionObj = positionList?.find(
    //     (x) => x.id == e.target.value
    // );
    // setPositionId(positionObj?.id);
    // let { name, value } = e.target;
    let check = true;
    let listSelected = [...selectedOption];
    let listSelectedBeforeChange = [...selectedOptionOnEventClick];
    let listChangePosition = [...listShiftPositons];
    listChangePosition.map((pos, i) => {
      if (pos.positionId == e.value) {
        listChangePosition[index] = listChangePosition[i];
        listChangePosition[index].quantity = 1;
        listChangePosition.splice(i, 1);
        check = false;
      }
    });
    if (check) {
      listChangePosition[index]["positionId"] = e.value;
    }
    listSelected = listSelectedBeforeChange.filter((x) => x.value !== e.value);
    setSelectedOption(listSelected);
    setListShiftPositons(listChangePosition);
  };
  const filterOptions = (candidate) => {
    if (
      selectedOption.some((opt) => {
        if (opt.value === candidate.value) return true;
        else return false;
      })
    )
      return true;
    return false;
  };
  const handleNavigate = async (id) => {
    await getWorkShift(id, dispatch, user?.data?.token?.accessToken, axiosJWT);
    navigate(process.env.PUBLIC_URL + "/calander/" + id);
  };
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle={`Week ${schedule?.weekNumber}`}
        isTabShow={true}
        // headerTitle={`Week ${schedule?.weekNumber} - ${moment(schedule?.startDate).format('MMM Do YYYY')} - ${moment(schedule?.endDate).format('MMM Do YYYY')}`}
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <Select
                className="me-2"
                options={listScheduleForSelect}
                value={{ label: `Week ${schedule?.weekNumber}`, value: schedule?.id }}
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                // value={frameId}
                onChange={(e) => {
                  handleNavigate(e.value);
                }}
              ></Select>
              <button
                className="btn btn-dark btn-set-task w-sm-100 me-2"
                hidden={
                  localStorage.getItem("role") !== "3" ||
                  schedule?.status === 2 ||
                  schedule?.status === -1
                }
                onClick={() => {
                  setIsAssignShiftModal(true);
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Assign Shift
              </button>
              <Dropdown
                hidden={localStorage.getItem("role") !== "3"}
                className="btn-group"
              >
                <Dropdown.Toggle
                  as="button"
                  className="btn dropdown-toggle btn-dark btn-set-task w-sm-100 me-2"
                >
                  <i className="icofont-ui-settings  fs-6"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <li>
                    <button
                      hidden={schedule?.status !== 0}
                      className="dropdown-item"
                      onClick={() => {
                        setIsTemplateModal(true);
                      }}
                    >
                      Choose Template
                    </button>
                  </li>
                  <li>
                    <button
                      hidden={schedule?.status === 0}
                      className="dropdown-item"
                      onClick={() => {
                        setIsSetTemplateModal(true);
                      }}
                    >
                      {!(schedule?.isTemplate === true)
                        ? `Set As Template`
                        : `Remove this template`}
                    </button>
                  </li>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          );
        }}
      />
      <div className="row clearfix g-3">
        <div className="card">
          <div className="py-3 px-3">
            {isLoading && <GrowingSpinner></GrowingSpinner>}
            {!isLoading && (
              <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                selectable={true}
                headerToolbar={{
                  start: "title", // will normally be on the left. if RTL, will be on the right
                  center: "",
                  end: "",
                }}
                firstDay={1}
                editable={false}
                initialView="timeGridWeek"
                // eventDrop={}
                eventClick={(info) => {
                  handleEventClick(info);
                }}
                events={eventsData}
                eventTimeFormat={{
                  hour: "numeric",
                  minute: "2-digit",
                  meridiem: "short",
                }}
                eventTextColor="black"
                eventClassNames="fw-bold"
                // eventMaxStack={1}
                allDaySlot={false}
                initialDate={shift?.workSheduleResponses?.startDate}
                select={(info) => {
                  handleSelect(info);
                }}
                selectMirror={true}
              />
            )}
          </div>
        </div>
      </div>
      <AssignShiftModal
        show={isAssignShiftModal}
        isAssignShiftModal={isAssignShiftModal}
        onHide={() => setIsAssignShiftModal(false)}
        setIsAssignShiftModal={setIsAssignShiftModal}
        foreUpdate={foreUpdate}
      ></AssignShiftModal>
      <Modal
        centered
        show={isModal}
        onHide={() => {
          // setlistPositionForEdit(positionList)
          setSelectedOption(
            positionList
              ?.filter((item) => item.name !== "Store Manager" && item.active)
              .map((d, i) => {
                return {
                  value: d.id,
                  label: d.name,
                };
              })
          );
          setSelectedOptionOnEventClick(
            positionList
              ?.filter((item) => item.name !== "Store Manager" && item.active)
              .map((d, i) => {
                return {
                  value: d.id,
                  label: d.name,
                };
              })
          );
          setListShiftPositons([{ positionId: 0, quantity: "" }]);
          setisSplitShift(false);
          setIsModal(false);
          setIsEditModalData(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {isEditModalData ? "Edit Shift" : "Create New Shift"}
          </Modal.Title>
        </Modal.Header>
        {isLoading && <GrowingSpinner></GrowingSpinner>}
        {!isLoading && (
          <Modal.Body>
            <form data-parsley-validate="" onSubmit={handleCreate}>
              <div className="row g-3 mb-3">
                <div className="col-sm-9">
                  <label htmlFor="depone" className="form-label">
                    Shift Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="depone"
                    name="branchName"
                    value={isEditModalData ? shiftName : null}
                    onChange={(e) => setShiftName(e.target.value)}
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
                        defaultChecked={isSplitShift ? isSplitShift : false}
                        onChange={(e) => setisSplitShift(e.target.checked)}
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="depone" className="form-label">
                  Time Frame
                </label>
                <Select
                  options={listTimeframeForSelect}
                  // value={frameId}
                  onChange={(e) => {
                    setFrameId(e.value);
                  }}
                ></Select>
              </div>
              <div className="mb-3">
                <label htmlFor="depone" className="form-label">
                  Date
                </label>
                {isEditModalData ? (
                  <Select
                    options={dayList}
                    // defaultValue={moment(addStartDate).format('YYYY-MM-DD')}
                    value={listDayToAdd}
                    onChange={(e) => {
                      setListDayToAdd([e]);
                    }}
                  ></Select>
                ) : (
                  <Select
                    options={dayList}
                    isMulti
                    isClearable
                    closeMenuOnSelect={false}
                    // defaultValue={moment(addStartDate).format('YYYY-MM-DD')}
                    value={listDayToAdd}
                    onChange={(e) => {
                      setListDayToAdd(e);
                    }}
                  ></Select>
                )}
              </div>
              <div className="deadline-form">
                <div className="row g-3 mb-3">
                  <div className="col-sm-6">
                    <label htmlFor="depone" className="form-label">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="timepickerded29"
                      value={addStartTime}
                      onChange={changeStartDate}
                      required
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="deptwo" className="form-label">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="timepickerded29"
                      value={addEndTime}
                      onChange={changeEndDate}
                      required
                    />
                  </div>
                </div>
                {listShiftPositons.map((position, index) => (
                  <div key={index} className="row g-3 mb-3">
                    <div className="col-sm-6">
                      <label
                        htmlFor="deptwo"
                        className="form-label"
                        hidden={position.quantity === 0}
                      >
                        Position
                      </label>
                      {position.quantity !== 0 && (
                        <Select
                          options={listPositionForEdit}
                          defaultValue={{
                            label: getPositionNameById(position?.positionId),
                            value: position?.positionId,
                          }}
                          onChange={(e) => changePosition(e, index)}
                          // defaultInputValue={getPositionNameById(position?.positionId)}
                          isDisabled={isEditModalData && position.id}
                          hideSelectedOptions={false}
                          filterOption={filterOptions}
                          isSearchable={false}
                        ></Select>
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
                      {listShiftPositons.length > 1 && (
                        <button
                          type="button"
                          hidden={position.quantity === 0}
                          className="btn btn-outline-secondary "
                          onClick={() =>
                            handlePostionRemove(position?.positionId, index)
                          }
                        >
                          <i className="icofont-ui-delete text-danger"></i>
                        </button>
                      )}
                      <input
                        type="number"
                        className="form-control"
                        id="depone"
                        hidden={position?.quantity === 0}
                        name="quantity"
                        min="1"
                        step={1}
                        value={position?.quantity}
                        onChange={(e) => changeQuantity(e, index)}
                        required
                      />
                    </div>
                    {listShiftPositons?.length - 1 === index &&
                      listShiftPositons?.length < positionList?.length - 1 && (
                        // {((listShiftPositons?.filter((item) => item.quantity !== 0))).length - 1 === index && (

                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handlePositionAdd}
                        >
                          <i className="icofont-edit text-success"></i>
                        </button>
                      )}
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
      <ShiftDetailsModal
        show={isShiftDetailsModal}
        id={shiftIdForEdit}
        isShiftDetailsModal={isShiftDetailsModal}
        setIsShiftDetailsModal={setIsShiftDetailsModal}
        fore={foreUpdate}
        onHide={() => {
          setSelectedOption(
            positionList
              ?.filter((item) => item.name !== "Store Manager" && item.active)
              .map((d, i) => {
                return {
                  value: d.id,
                  label: d.name,
                };
              })
          );
          setSelectedOptionOnEventClick(
            positionList
              ?.filter((item) => item.name !== "Store Manager" && item.active)
              .map((d, i) => {
                return {
                  value: d.id,
                  label: d.name,
                };
              })
          );
          setListShiftPositons([{ positionId: 0, quantity: "" }]);
          setisSplitShift(false);
          setIsShiftDetailsModal(false);
          setIsEditModalData(false);
          foreUpdate();
        }}
      ></ShiftDetailsModal>
      <SetAsTemPlateModal
        show={isSetTemplateModal}
        onHide={() => setIsSetTemplateModal(false)}
        setIsSetAsTemplateModal={setIsSetTemplateModal}
        id={id}
        foreUpdate={foreUpdate}
      ></SetAsTemPlateModal>
      <SelectTemplateModal
        show={isTemplateModal}
        onHide={() => setIsTemplateModal(false)}
        foreUpdate={foreUpdate}
        id={id}
      ></SelectTemplateModal>
    </div>
  );
}

export default Calendar;
