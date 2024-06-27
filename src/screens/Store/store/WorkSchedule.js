import React from "react";
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getWorkShift } from "../../../redux/workschedule/workscheduleApi";
import { createAxios } from "../../../createInstance";
import { loginSuccess } from "../../../redux/auth/authSlice";

function WorkSchedule(props) {
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const { week,start, end, id,status } = props;
    
    let startDate = moment(start).format('MMM Do YYYY');
    let endDate = moment(end).format('MMM Do YYYY');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let axiosJWT = createAxios(user,dispatch,loginSuccess)
    const handleNavigate = async() =>{
        await getWorkShift(id, dispatch,user?.data?.token?.accessToken,axiosJWT)
        navigate(
            process.env.PUBLIC_URL + "/calander/" + id
        )
    }
    
    return (
        <div className={`timeline-item ${status === 0 ? 'ti-warning' : status === 1 ? 'ti-primary' : status === 2 ? 'ti-success' : 'ti-danger'} border-bottom ms-2`}>
            <div className="d-flex">
                <div className="flex-fill ms-3">
                    <span className="d-flex text-muted"
                        onClick={handleNavigate}>Week {week} - {startDate} - {endDate}</span>
                </div>
            </div>
        </div >
    )
}


export default WorkSchedule;