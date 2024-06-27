import React from "react";
import { ProgressBar } from "react-bootstrap";

function StoreWorkHoursTable(props) {
  const { dashboard,setEmployeeId,setIsDetailsModal,setName } = props;
  const progress = (finish,total) => {
    const prog = (finish/total)*100
    if(prog){
        return prog
    }else return 0
  }
  return (
    <div className="card mb-3">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Employee Work Hours</h6>
        </div>
      </div>
      <div className="card-body">
        <div
          id="storeWorkHoursTable_wrapper"
          className="dataTables_wrapper dt-bootstrap5 no-footer"
        >
          <div className="row">
            <div className="col-sm-12">
              <div className="table-responsive">
                <table
                  id="storeWorkHoursTable"
                  className="table table-hover align-middle mb-0 nowrap dataTable no-footer dtr-inline"
                  role="grid"
                  aria-describedby="storeWorkHoursTable_info"
                >
                  <thead>
                    <tr role="row">
                      <th
                        className="sorting_asc "
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-sort="ascending"
                        aria-label="Title: activate to sort column descending"
                      >
                        Employee
                      </th>
                      <th
                        className="sorting text-center"
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Date Start: activate to sort column ascending"
                      >
                        Today Work Hours
                      </th>
                      <th
                        className="sorting text-center"
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Deadline: activate to sort column ascending"
                      >
                        Month Work Hours
                      </th>
                      <th
                        className="sorting text-center"
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Deadline: activate to sort column ascending"
                      >
                        Work Hours Remaining
                      </th>
                      <th
                        className="sorting text-center"
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Completion: activate to sort column ascending"
                      >
                        Completion
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard?.map((data, i) => (
                      <tr role="row" onClick={()=>{setEmployeeId(data?.employeeId);setIsDetailsModal(true);setName(data?.employeeName)}} key={"dasd"+i}>
                        <td>
                          {data?.employeeName}
                        </td>
                        <td align="center">{data?.totalTodayWorkDurationFinished}</td>
                        <td align="center">{data?.totalMonthWorkDurationFinished}</td>
                        <td align="center">{data?.totalMonthWorkDurationReady}</td>
                        <td>
                          <ProgressBar variant="primary" now={progress(data?.totalMonthWorkDurationFinished,data?.totalMonthWorkDuration)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreWorkHoursTable;
