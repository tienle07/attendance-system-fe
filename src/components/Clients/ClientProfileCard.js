import React from "react";
import moment from "moment";

function ClientProfileCard(props) {
  const {
    code,
    name,
    phone,
    email,
    address,
    enrollmentDate,
    image,
    active,
    dateofbirth,
    citizenid,
    sex,
    nationality,
    placeOfOrigrin,
    placeOfResidence,
    dateOfIssue,
    issuedBy,
  } = props;
  return (
    <div className="card teacher-card  mb-3">
      <div className="card-body d-flex teacher-fulldeatil">
        <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
          <a href="#!">
            <img
              src={image}
              alt=""
              className="avatar xxl rounded-circle img-thumbnail shadow-sm"
            />
          </a>
          <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
            <h6 className="text fw-bold d-block fs-6">{code}</h6>
            {active ? (
              <span className="badge bg-success mb-0 fw-bold d-block fs-6">
                Active
              </span>
            ) : (
              <span className="badge bg-danger mb-0 fw-bold d-block fs-6">
                Inactive
              </span>
            )}
          </div>
        </div>
        <div className="teacher-info border-start ps-xl-4 ps-md-4 ps-sm-4 ps-4 w-100">
          <div className="row g-2 pt-2">
            <div className="col-xl-4 col-lg-12 col-md-12">
              <h6 className="mb-0 mt-2  fw-bold d-block fs-6">{name}</h6>

              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <i className="icofont-ui-touch-phone"></i>
                  <span className="ms-2 small">{phone} </span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <i className="icofont-email"></i>
                  <span className="ms-2 small">{email}</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <i className="icofont-birthday-cake"></i>
                  <span className="ms-2 small">
                    {moment(dateofbirth).format("DD-MM-YYYY")}
                  </span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <i className="icofont-flag"></i>
                  <span className="ms-2 small">
                    {moment(enrollmentDate).format("DD-MM-YYYY")}
                  </span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <i className="icofont-address-book"></i>
                  <span className="ms-2 small">{address}</span>
                </div>
              </div>
            </div>
            <div className="border-start ps-xl-4 ps-md-4 ps-sm-4 ps-4 col-xl-8 col-lg-12 col-md-12">
              <h6 className="mb-0 mt-2  fw-bold d-block fs-6">CID Card</h6>

              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <span className="ms-2 small fw-bold ">Citizen ID: </span>
                  <span className="ms-2 small">{citizenid}</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold ms-2 small">Sex: </span>

                  <span className="ms-2 small">{sex}</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold ms-2 small">Nation: </span>

                  <span className="ms-2 small">{nationality}</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold ms-2 small">Date Of Issue: </span>

                  <span className="ms-2 small">
                    {moment(dateOfIssue).format("DD-MM-YYYY")}
                  </span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold ms-2 small">Issue By: </span>

                  <span className="ms-2 small">{issuedBy}</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold ms-2 small">Place Of Origin: </span>

                  <span className="ms-2 small">{placeOfOrigrin}</span>
                </div>
              </div>
              <div className="row pt-2">
                <div className="d-flex align-items-center">
                  <span className="fw-bold ms-2 small">
                    Place Of Residence:{" "}
                  </span>

                  <span className="ms-2 small">{placeOfResidence}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfileCard;
