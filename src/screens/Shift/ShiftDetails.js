import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import RecentActivity from "../../components/Projects/RecentActivity";
import { CompletedData, InProgressTaskData, needReviewData } from "../../components/Data/AppData";
import TaskNestable1 from "../../components/Projects/TaskNestable1";
import EmployeeAvailable from "./EmployeeAvailable";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ShiftInfor from "./ShiftInfor";
import PositionInShift from "./PositionInShift";

function ShiftDetails() {
    const [isModal, setIsModal] = useState(false);
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
          navigate(process.env.PUBLIC_URL + "/sign-in");
        }
        // getShiftDetails(id,dispatch, user?.data?.token?.accessToken);
      }, []);

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Shift"
                renderRight={() => {
                    return <div className="col-auto d-flex w-sm-100">
                        <button className="btn btn-dark btn-set-task w-sm-100" onClick={() => { setIsModal(true) }}><i className="icofont-plus-circle me-2 fs-6"></i>Create Task</button>
                    </div>
                }}
            />
            <div className="row clearfix g-3">
                <div className="col-lg-12 col-md-12 flex-column">
                    <div className="row g-3 row-deck">
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                            <ShiftInfor />
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6"><PositionInShift /></div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12"><EmployeeAvailable /></div>
                    </div>
                  
                    <TaskNestable1
                        InProgressTaskData={InProgressTaskData}
                        needReviewData={needReviewData}
                        CompletedData={CompletedData}
                    />
                </div>
            </div>
            <Modal show={isModal} onHide={() => { setIsModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Create Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                <PageHeader headerTitle="Shift"
                renderRight={() => {
                    return <div className="col-auto d-flex w-sm-100">
                        <button className="btn btn-dark btn-set-task w-sm-100" onClick={() => { setIsModal(true) }}><i className="icofont-plus-circle me-2 fs-6"></i>Create Task</button>
                    </div>
                }}
            />
            <div className="row clearfix g-3">
                <div className="col-lg-12 col-md-12 flex-column">
                    <div className="row g-3 row-deck">
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6">
                            <ShiftInfor />
                        </div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6"><RecentActivity /></div>
                        <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12"><EmployeeAvailable /></div>
                    </div>
                  
                    <TaskNestable1
                        InProgressTaskData={InProgressTaskData}
                        needReviewData={needReviewData}
                        CompletedData={CompletedData}
                    />
                </div>
            </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={() => { setIsModal(false) }}>Done</button>
                    <button type="button" className="btn btn-primary">Create</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}


export default ShiftDetails;