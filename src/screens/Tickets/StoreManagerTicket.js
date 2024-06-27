import React, {useState } from "react";
import DataTable from "react-data-table-component";
import { Modal } from "react-bootstrap";
import PageHeader from "../../components/common/PageHeader";
import { TicketsViewData } from "../../components/Data/AppData";
import { useEffect } from "react";
import { getAllApplicationInStore, getSelectedApplicationDetails } from "../../redux/ticket/ticketApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useReducer } from "react";
import moment from 'moment';
import { getEmployeePosition, getEmployeeType } from "../../redux/employee/employeeApi";


function StoreManagerTicket() {
    const storeId = localStorage.getItem("storeid")
    const [isModal, setIsModal] = useState(false);
    const [siEditModal, setSiEditModal] = useState("");
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const allTicket = useSelector((state) => state.application?.application?.allApplication);

    const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    var columnT = ""

    useEffect(() => {
        if (!user) {
            navigate(process.env.PUBLIC_URL + "/sign-in");
        }
        if (user?.data?.token?.accessToken) {
            getAllApplicationInStore(storeId,user?.data?.token?.accessToken,dispatch);
            getEmployeeType(dispatch, user?.data?.token?.accessToken);
            getEmployeePosition(dispatch, user?.data?.token?.accessToken);
        }
    }, [reducerValue]);

    columnT = [
        {
            name: "EMPLOYEE NAME",
            selector: (row) => row.employeeName,
            sortable: true,
        },
        {
            name: "Type",
            selector: (row) => row.typeName,
            sortable: true
        }, 
        {
            name: "Content",
            selector: (row) => row.content,
            sortable: true
        },  
        {
            name: "CREATD DATE",
            selector: (row) => moment(row.createDate).format('MMMM Do YYYY'),
            sortable: true
        },
        {
            name: "STATUS",
            selector: (row) => { },
            sortable: true,
            cell: row =>
            row.status === 0 ? 
                <span className="badge bg-warning">Pending</span> :
                    row.status === 1 ?
                        <span className="badge bg-success">Approved</span> :
                            <span className="badge bg-error">Reject</span>
            
        },
        
    ]


    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Tickets" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                    <button className="btn btn-dark btn-set-task w-sm-100" onClick={() => { setIsModal(true) }}><i className="icofont-plus-circle me-2 fs-6"></i>Add Tickets</button>
                </div>
            }} />
            <div className="row clearfix g-3">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <DataTable
                                title={TicketsViewData.title}
                                columns={columnT}
                                data={allTicket ? allTicket : []}
                                defaultSortField="title"
                                pagination
                                onRowClicked={(e) => {
                                    getSelectedApplicationDetails(e.id, user?.data?.token?.accessToken, dispatch)
                                    navigate(
                                        process.env.PUBLIC_URL + "/application/" + e.id
                                    );
                                }}
                                selectableRows={false}
                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                highlightOnHover={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Modal centered show={isModal} onHide={() => { setIsModal(false); setSiEditModal("") }}>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">{siEditModal !== "" ? "Edit" : "Add"} Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label htmlFor="sub" className="form-label">Subject</label>
                        <input type="text" className="form-control" id="sub" onChange={() => { }} value={siEditModal ? siEditModal.subject : ""} />
                    </div>
                    <div className="deadline-form">
                        <form>
                            <div className="row g-3 mb-3">
                                <div className="col-lg-6">
                                    <label htmlFor="depone" className="form-label">Assign Name</label>
                                    <input type="text" className="form-control" id="depone" onChange={() => { }} value={siEditModal ? siEditModal.assigned : ""} />
                                </div>
                                <div className="col-lg-6">
                                    <label htmlFor="deptwo" className="form-label">Creted Date</label>
                                    <input type="date" className="form-control" id="deptwo" onChange={() => { }} value={siEditModal ? siEditModal.createdate : ""} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-select">
                            <option >In Progress</option>
                            <option value="1">Completed</option>
                            <option value="2">Wating</option>
                            <option value="3">Decline</option>
                        </select>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-secondary" onClick={() => { setIsModal(false) }}>Done</button>
                    <button type="button" className="btn btn-primary">Sent</button>
                </Modal.Footer>
            </Modal>
        </div>
    )

}

export default StoreManagerTicket;