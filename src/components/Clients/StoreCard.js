import React from "react";

function StoreCard (props){
    
        const {storeName,mng,address,active,onClickEdit,onClickDelete,onClickView} = props;
        return(
            <div className="card border-success">
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mt-5">
                        
                        <div className="lesson_name">
                            <span className="project_name fw-bold text-primary">{storeName}</span>
                            <div>
                                
                                <h6 className="mb-0 fw-bold fs-6 mb-2">
                                    <i className="icofont-business-man  ">    </i>
                                    {mng}
                                </h6>
                            </div>
                            
                        </div>  
                                 
                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" className="btn btn-outline-secondary " onClick={onClickView}><i className="icofont-eye text-info"></i></button>
                            <button type="button" disabled={active === false} className="btn btn-outline-secondary " onClick={onClickEdit}><i className="icofont-edit text-success"></i></button>
                            <button type="button" disabled={active === false} className="btn btn-outline-secondary " onClick={onClickDelete}><i className="icofont-ui-delete text-danger"></i></button>
                        </div>
                    </div>               
                    <div className="row g-2 pt-4">
                        <div>
                            <div className="d-flex align-items-center">
                                <i className="icofont-address-book "></i>
                                <span className="ms-2 ">{address}</span>
                            </div>
                        </div>
                        <div className="">
                            <div className="d-flex flex-row-reverse">
                                {active ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span> }
                            </div>
                        </div>
                        </div>
                    {/* <div className="dividers-block"></div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h4 className="small fw-bold mb-0">Progress</h4>
                        <span className="small light-danger-bg  p-1 rounded"><i className="icofont-ui-clock"></i> 35 Days Left</span>
                    </div>
                    <ProgressBar style={{height: "8px"}}>
                        <ProgressBar variant="secondary" now={15} style={{width: "25%"}}/>
                        <ProgressBar variant="secondary" now={30} style={{width: "25%", marginLeft:10}}/>
                        <ProgressBar variant="secondary" now={10} style={{width: "25%", marginLeft:10}}/>
                    </ProgressBar> */}
                </div>
            </div>
        )
    }


export default StoreCard;