import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useReducer } from "react";
import { useState } from "react";
import { useEffect } from "react";
import WorkSchedule from "./WorkSchedule";
import { toast } from "react-toastify";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/auth/authSlice";
import { getWorkScheduleWithPaging } from "../../../redux/workschedule/workscheduleApi";

function CurrentStoreWorkSchedule(props) {
  const { id, fore } = props;
  const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);
  const [currentPage, setCurrentPage] = useState(1);
//   const [total, setTotal] = useState(11);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const workScheduleList = useSelector(
    (state) => state.workschedule?.workscheduleWithPaging?.schedule
  );
  const total = useSelector(
    (state) => state.workschedule?.workscheduleWithPaging?.metaData?.total
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate(process.env.PUBLIC_URL + "/sign-in");
    }
    getWorkScheduleWithPaging(
      id,
      dispatch,
      user?.data?.token?.accessToken,
      axiosJWT,
      currentPage,
      4
    );
  }, [reducerValue]);
  const handleNewScheduleClick = async () => {
    const store = {
      storeId: id,
    };
    try {
      const res = await axiosJWT.post(
        "api/workschedule/manager-create-new-schedule/" + id,
        store,
        {
          headers: {
            Authorization: `Bearer ${user?.data?.token?.accessToken}`,
          },
        }
      );

      if (res.data.code >= 200 && res.data.code < 300) {
        toast.success("Create Schedule For Next Week Success");
        fore();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };
  const getTotalPages = () => Math.ceil(total / pageSize) || 1;
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
  };
  const renderPageTabs = () => {
    const totalPages = getTotalPages();
    const tabs = [];
    const visiblePages = 5;

    for (
      let i = Math.max(1, currentPage - Math.floor(visiblePages / 2));
      i <= Math.min(totalPages, currentPage + Math.floor(visiblePages / 2));
      i++
    ) {
      tabs.push(
        <li className="page-item">
          <a
            onClick={() => handlePageChange(i)}
            className={`page-link ${currentPage === i ? "active" : ""}`}
          >
            {i}
          </a>
        </li>
      );
    }

    if (currentPage - Math.floor(visiblePages / 2) > 1) {
      tabs.unshift(<li className={`page-link`}>...</li>);
    }

    if (currentPage + Math.floor(visiblePages / 2) < totalPages) {
      tabs.push(<li className={`page-link`}>...</li>);
    }

    return tabs;
  };
  return (
    <div className="card">
      <div className="card-header py-3">
        <div className="d-flex align-items-center justify-content-between ">
          <div className="lesson_name">
            <h6 className="mb-0 fw-bold ">Schedule</h6>
          </div>
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              hidden={localStorage.getItem("role") !== "3"}
              className="btn btn-dark"
              onClick={handleNewScheduleClick}
            >
              <i className="icofont-plus-circle me-2 fs-6"> New Schedule</i>
            </button>
          </div>
        </div>
      </div>
      <div className="card-body">
        {workScheduleList
          ? workScheduleList.map((d, i) => {
              return (
                <div key={"ljsdhl" + i}>
                  <WorkSchedule
                    week={d.weekNumber}
                    start={d.startDate}
                    end={d.endDate}
                    id={d.id}
                    status={d.status}
                  />
                </div>
              );
            })
          : null}
        <div className="d-flex flex-row-reverse pt-3">
          <nav aria-label="Page navigation">
            <ul className="pagination mb-0">
              <li className="page-item">
                <a className="page-link" onClick={() => handlePageChange(1)}>
                  <span>«</span>
                </a>
              </li>
              {renderPageTabs()}
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={() => handlePageChange(getTotalPages())}
                >
                  <span>»</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default CurrentStoreWorkSchedule;
