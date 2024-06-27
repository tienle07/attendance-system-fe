import React from "react";
import clock from "../../../assets/images/change-log.svg";

function TotalHoursWork(props) {
    const { dashboard } = props;

    return (
        <div className="card bg-primary">
            <div className="card-body row">
                <div className="col">
                    <span className="avatar lg bg-white rounded-circle text-center d-flex align-items-center justify-content-center"><i className="icofont-wall-clock fs-2"></i></span>
                    <h1 className="mt-3 mb-0 fw-bold text-white">{dashboard?.totalMonthWorkDuration?.toFixed(1)}</h1>
                    <span className="text-white">Total Hours Work</span>
                </div>
                <div className="col">
                    <img className="img-fluid" src={clock} alt="clock" />
                </div>
            </div>
        </div>
    )
}


export default TotalHoursWork;