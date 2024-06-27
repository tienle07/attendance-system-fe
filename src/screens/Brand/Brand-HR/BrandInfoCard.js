import React, { useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import StatusCard from "../../../components/Ticket/StatusCard";
import BrandDetailsCard from "../BrandDetailsCard";
import GrowingSpinner from "../../../components/UI/GrowingSpinner";
function BrandInfoCard() {
  const data = useSelector(
    (state) => state.brand?.currentBrandSelect?.curBrand
  );
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const isGetBranch = useSelector(
    (state) => state.branchs?.currentBranchSelect?.isFetching
  );
  return (
    <div className="container-xxl">
      {isGetBranch && <GrowingSpinner></GrowingSpinner>}
      {!isGetBranch && (
        <div>
          <div className="row g-3">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <StatusCard
                    progress=""
                    details={data?.name}
                    iconClass="icofont-home fs-4"
                    iconbg="light-success-bg"
                    title="Brand"
                  />
                </div>
                <div className="col-md-4">
                  <StatusCard
                    progress=""
                    details={moment(data?.createDate).format("DD-MM-YYYY")}
                    iconClass="icofont-home fs-4"
                    iconbg="light-success-bg"
                    title="Create Date"
                  />
                </div>
                <div className="col-md-4">
                  <StatusCard
                    progress={data?.active ? "Active" : "Inactive"}
                    progressBg={data?.active ? "bg-success" : "bg-error"}
                    details=""
                    iconClass="icofont-price fs-4"
                    iconbg="light-success-bg"
                    title="Status"
                  />
                </div>
              </div>
              <BrandDetailsCard
                data={data && data}
                address={data?.address}
                name={data?.name}
                id={data?.id}
                phone={data?.phone}
                contactPerson={data?.contactPerson}
                description={data?.description}
                logoUrl={data?.logoUrl}
                active={data?.active}
                role={user?.data?.account.roleId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BrandInfoCard;
