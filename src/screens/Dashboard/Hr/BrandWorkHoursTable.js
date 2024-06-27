import React from "react";
import Avatar1 from "../../../assets/images/xs/avatar1.jpg";
import Avatar2 from "../../../assets/images/xs/avatar2.jpg";
import Avatar3 from "../../../assets/images/xs/avatar3.jpg";
import Avatar4 from "../../../assets/images/xs/avatar4.jpg";
import Avatar5 from "../../../assets/images/xs/avatar5.jpg";
import Avatar6 from "../../../assets/images/xs/avatar6.jpg";
import Avatar7 from "../../../assets/images/xs/avatar7.jpg";
import { ProgressBar } from "react-bootstrap";

function BrandWorkHoursTable(props) {
  const { dashboard } = props;
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
          <h6 className="mb-0 fw-bold ">Store Month Work Hours</h6>
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
                        className="sorting_asc"
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-sort="ascending"
                        aria-label="Title: activate to sort column descending"
                      >
                        Store
                      </th>
                      <th
                        className="sorting text-center"
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Date Start: activate to sort column ascending"
                      >
                        Total Employee
                      </th>
                      <th
                        className="sorting text-center"
                        tabIndex="0"
                        aria-controls="storeWorkHoursTable"
                        rowSpan="1"
                        colSpan="1"
                        aria-label="Deadline: activate to sort column ascending"
                      >
                        Work Hours
                      </th>
                      <th
                        className="sorting"
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
                      <tr role="row" key={"dasd"+i}>
                        <td>
                          {data?.storeName}
                        </td>
                        <td align="center">{data?.totalStoreEmployee}</td>
                        <td align="center">{data?.dashBoardCommonFields?.totalMonthWorkDurationFinished}</td>
                        <td>
                          <ProgressBar variant="primary" now={progress(data?.dashBoardCommonFields?.totalMonthWorkDurationFinished,data?.dashBoardCommonFields?.totalMonthWorkDuration)} />
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

export default BrandWorkHoursTable;
