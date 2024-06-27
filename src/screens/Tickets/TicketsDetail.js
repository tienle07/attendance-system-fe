import React from "react";
import PageHeader from "../../components/common/PageHeader";
import { Calendar } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import StatusCard from "../../components/Ticket/StatusCard";
import DataTable from "react-data-table-component";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSelectedApplicationDetails } from "../../redux/ticket/ticketApi";
import { useReducer } from "react";
import { useEffect } from "react";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import axios from "axios";
import { toast } from "react-toastify";
let columnT = []
function TicketsDetail() {
    const storeId = localStorage.getItem("storeid")

    const user = useSelector((state) => state.auth?.login?.currentUser);
    const application = useSelector((state) => state.application?.selectedApplication?.application?.application);
    const shift = useSelector((state) => state.application?.selectedApplication?.application?.employeeShifts);
    const shiftPosition = useSelector((state) => state.application?.selectedApplication?.application?.employeeShifts[0].workShift?.shiftPositions[0]?.positionId);
    const shiftDate = useSelector((state) => state.application?.selectedApplication?.application?.employeeShifts[0].workShift.startTime);
    const positionList = useSelector((state) => state.employees?.employeePosition?.position);



    const { id } = useParams("id");


    const [isModal, setIsModal] = useState(false);
    const [check, setCheck] = useState(true);
    const [dataCheckBox, setDataCheckBox] = useState([]);
    const [siEditModal, setSiEditModal] = useState("");
    const [eventsData, seteventsData] = useState([])
    const [reducerValue, foreUpdate] = useReducer((x) => x + 1, 0);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    var eventsDatas = shift?.map((d, i) => {
        return {
            id: d.workShift.id,
            title: d.workShift.shiftPositions[0].available + " Slot Available",
            start: d.workShift.startTime,
            end: d.workShift.endTime,
            // extendedProps: d.shiftPositions
        }
    })
    useEffect(() => {
        if (!user) {
            navigate(process.env.PUBLIC_URL + "/sign-in");
        }
        if (user?.data?.token?.accessToken) {
            getSelectedApplicationDetails(id, user?.data?.token?.accessToken, dispatch)
        }
    }, [reducerValue]);
    const getPositionNameById = (id) => {
        const positionObj = positionList?.find(
            (x) => x.id == id
        );

        return positionObj.name
    }
    const handleCheckBox = (row, e) => {
        if (e) {
            const checkWorkShiftIdExists = dataCheckBox?.find(
                (x) => x === row
            );
            if (checkWorkShiftIdExists) {
                return
            }
            setDataCheckBox(old => [...old, row])
        }
        if (!e) {
            const checkWorkShiftIdExists = dataCheckBox?.find(
                (x) => x === row
            );
            if (checkWorkShiftIdExists) {
                const list = dataCheckBox.filter(
                    (x) => x !== row
                )
                setDataCheckBox(list)
            }
        }

    }
    const handleApprove = async () => {
        const approve = {
            applicationId: Number(id),
            workShifts: dataCheckBox
        }
        try {
            const res = await axios.put(
                "/api/application/manager-update-application",
                approve,
                {
                    headers: {
                        Authorization: `Bearer ${user?.data?.token?.accessToken}`,
                    },
                }
            );
            if (res.data.code >= 200 && res.data.code < 300) {
                toast.success("Approve Success");
                foreUpdate();
            }
        } catch (err) {
            console.log(err);
        }
    }
    columnT = [
        {
            name: "Date",
            selector: (row) => moment(row.workShift.startTime).format('DD-MM-YYYY'),
        },
        {
            name: "Start",
            selector: (row) => moment(row.workShift.startTime).format('h:mm a'),
        },
        {
            name: "End",
            selector: (row) => moment(row.workShift.endTime).format('h:mm a'),
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
                        row.status === 2 ?
                            <span className="badge bg-success">Ready</span> :
                            row.status === 3 ?
                                <span className="badge bg-warning">On-Going</span> :
                                row.status === 4 ?
                                    <span className="badge bg-success">Finish</span> :
                                    <span className="badge bg-danger">Reject</span>



        },
        {

            name: <div
                className="btn-group"
                role="group"
            >{dataCheckBox.length === 0 ?
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                        handleApprove()
                    }}
                >
                    <i className="text-truncate"> Reject</i>
                </button> :
                <button
                    type="button"
                    disabled={dataCheckBox.length === 0 || application?.status === 1 || application?.status === -1}
                    className="btn btn-dark"
                    onClick={() => {
                        handleApprove()
                    }}
                >
                    <i className="icofont-plus-circle me-2 fs-6"> Approve</i>
                </button>
                }

            </div>,
            cell: (row) => (
                <input type="checkbox" disabled={row.workShift.shiftPositions[0].available === 0 || application?.status === 1 || application?.status === -1}
                    name="checkbox" data-parsley-multiple="checkbox" onChange={(e) => { handleCheckBox(row.workShiftId, e.target.checked) }} />
            ),
        },
    ]
    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Tickets Detail" />
            <div className="row g-3">
                <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12">
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <StatusCard progress="" details={application?.employeeName} iconClass="icofont-military fs-4" iconbg="bg-primary" title="Created Name" />
                        </div>
                        <div className="col-md-4">
                            <StatusCard progress="" details={getPositionNameById(shiftPosition)} iconClass="icofont-user fs-4" iconbg="bg-lightblue" title="Position Apply" />
                        </div>
                        <div className="col-md-4">
                            <StatusCard progress={application.status === 0 ?
                                'Pending' :
                                application.status === 1 ?
                                    'Approve' :
                                    'Reject'
                            }
                                progressBg={application.status === 0 ?
                                    'bg-warning' :
                                    application.status === 1 ?
                                        'bg-success' :
                                        'bg-error'
                                }
                                details=""
                                iconClass="icofont-price fs-4" iconbg="bg-lightgreen" title="Status"
                            />
                        </div>
                    </div>
                    <div className="row g-3 mb-3">
                        <div className="row g-3">
                            <div className="col-md-12">
                                <DataTable
                                    title="Application"
                                    columns={columnT}
                                    data={shift ? shift : ''}
                                    defaultSortField="title"
                                    // pagination
                                    selectableRows={false}
                                    className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                    highlightOnHover={true}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
                    <FullCalendar
                        plugins={[listPlugin]}
                        selectable={true}
                        headerToolbar={{
                            start: 'title',
                            center: '',
                            end: ''
                        }}
                        editable={false}
                        initialView="listWeek"
                        events={eventsDatas ? eventsDatas : []}
                        initialDate={shiftDate}
                        firstDay={1}
                        height='auto'
                        // select={(info) => {
                        //     console.log(info);
                        // }}
                    />
                </div>

            </div>
        </div>
    )
}


export default TicketsDetail;