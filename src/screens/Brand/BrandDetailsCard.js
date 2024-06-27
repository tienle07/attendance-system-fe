import React from "react";
import StatusCard from "../../components/Ticket/StatusCard";

function BrandDetailsCard(props) {
  const {
    id,
    name,
    description,
    createDate,
    address,
    phone,
    contactPerson,
    logoUrl,
    active,
  } = props;
  return (
    <div className="card teacher-card  mb-3">
      <div className="card-body d-flex teacher-fulldeatil">
        <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
          <a href="#!">
            <img
              src={logoUrl}
              alt=""
              className="avatar xxl rounded-circle img-thumbnail shadow-sm"
            />
          </a>
          <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
            {/* <h6 className="mb-0 fw-bold d-block fs-6">{description}</h6> */}
            <span className="text-muted small">{description}</span>
          </div>
        </div>
        <div className="teacher-info border-start ps-xl-4 ps-md-4 ps-sm-4 ps-4 w-100">
          <div className="d-flex align-items-center justify-content-between ">
            {/* <div className="lesson_name">
                            <h6 className="mb-0 mt-2  fw-bold d-block fs-6">{description}</h6>
                        </div> */}
          </div>
          <div className="row g-2 pt-2">
            <div className="col-6">
              <StatusCard
                progress=""
                details={contactPerson}
                iconClass="icofont-military fs-4"
                iconbg="bg-info-light"
                title="Contact Person"
              />
            </div>
            <div className="col-6">
              <StatusCard
                progress=""
                details={phone}
                iconClass="icofont-ui-call fs-4"
                iconbg="bg-info-light"
                title="Phone"
              />
            </div>
            <div className="col-12">
              <StatusCard
                progress=""
                details={address}
                iconClass="icofont-address-book fs-4"
                iconbg="bg-info-light"
                title="Address"
              />
            </div>
            {/* <div className="col-xl-5">
                            <div className="d-flex align-items-center">
                                <i className="icofont-calendar"></i>
                                <span className="ms-2 small">{moment(createDate).format('MMMM Do YYYY')}</span>
                            </div>
                        </div>
                        <div className="col-xl-5">
                            <div className="d-flex align-items-center">
                                <i className="icofont-address-book"></i>
                                <span className="ms-2 small">{address}</span>
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandDetailsCard;
