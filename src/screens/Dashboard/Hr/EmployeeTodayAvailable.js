import React from "react";
import Select from "react-select";

function EmployeeTodayAvailable(props) {
  const { day, setDay, attendance, notIntime, absent, leave } = props;
  const select =[{
    label: 'Today',
    value:'Today',
  },{
    label:'This Month',
    value:'This Month',
  }]
  return (
    <div className="card" style={{minHeight: 385}}>
      <div className="card-header py-3 d-flex align-items-center justify-content-between  bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">{day} Attendance</h6>
        <Select
          options={select}
          onChange={(e) => setDay(e.value)}
          hideSelectedOptions={true}
        ></Select>
      </div>
      <div className="card-body">
        <div className="row g-2 row-deck">
          <div className="col-md-6 col-sm-6">
            <div className="card">
              <div className="card-body ">
                <i className="icofont-checked fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Attendance</h6>
                <span className="text-muted">{attendance}</span>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="card">
              <div className="card-body ">
                <i className="icofont-stopwatch fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Not In Time</h6>
                <span className="text-muted">{notIntime}</span>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="card">
              <div className="card-body ">
                <i className="icofont-ban fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Absent</h6>
                <span className="text-muted">{absent}</span>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="card">
              <div className="card-body ">
                <i className="icofont-beach-bed fs-3"></i>
                <h6 className="mt-3 mb-0 fw-bold small-14">Leave Apply</h6>
                <span className="text-muted">{leave}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeTodayAvailable;
