import React from "react";
import profileImg from "../../assets/images/lg/avatar3.jpg";

function StoreDetailCard(props) {
    const { data,storeName, address, id, mng, active, bssid, createDate, openTime, closeTime, latitude, longtitude, onClickManager, role } = props;
    return (
        <div className="card teacher-card  mb-3">
            <div className="card-body d-flex teacher-fulldeatil">
                <div className="teacher-info  ps-xl-4 ps-md-4 ps-sm-4 ps-4 w-100">
                    <div className="d-flex align-items-center justify-content-between ">
                        <div className="lesson_name">
                            <h6 className="mb-0 mt-2  fw-bold d-block fs-6"><i className="icofont-business-man  ">    </i>{mng}</h6>
                        </div>
                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                            {role !== 3 &&
                                <button type="button" className="btn btn-outline-secondary" onClick={onClickManager} ><i className="icofont-business-man text-success"></i></button>
                            }
                        </div>
                    </div>
                    <div className="row g-2 pt-4">
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <span className="ms-2 fw-bold ">Brand: </span>
                                <span className="ms-2 ">{localStorage.getItem('brandName')}</span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <span className="ms-2 fw-bold ">Open Time: </span>
                                <span className="ms-2 ">{openTime}</span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <span className="ms-2 fw-bold ">Latitude: </span>
                                <span className="ms-2 ">{latitude}</span>
                            </div>
                        </div>
                    </div>
                    <div className="row g-2 pt-2">
                        <div className="col">
                            <div className="d-flex align-items-center">
                            <span className="ms-2 fw-bold ">BSSID: </span>
                                <span className="ms-2 "> {bssid}</span>
                            </div>
                        </div>

                        <div className="col">
                            <div className="d-flex align-items-center">
                                {/* <i className="icofont-address-book"></i> */}
                                <span className="ms-2 fw-bold ">Close Time: </span>
                                <span className="ms-2 ">{closeTime}</span>
                            </div>
                        </div>
                        <div className="col">
                            <div className="d-flex align-items-center">
                                <span className="ms-2 fw-bold ">Longtitude: </span>
                                <span className="ms-2 ">{longtitude}</span>
                            </div>
                        </div>
                        
                    </div>

                    <div className="row g-2 pt-2">

                        <div className="col">
                            <div className="d-flex align-items-center">
                                <span className="ms-2 fw-bold ">Address: </span>
                                <span className="ms-2 ">{address} </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default StoreDetailCard;
