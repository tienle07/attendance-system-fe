import React from "react";
import style from "react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark";

function TypeAndPositionCard(props) {

    const { onClickAdd,data, title,onClickDelete } = props;
    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between ">
                    <div className="lesson_name">
                        <h6 className="fw-bold mb-3 text-danger mb-0 mt-2 d-block fs-6">{title}</h6>
                    </div>
                    <div className="btn-group" role="group" aria-label="Basic outlined example">
                        <button type="button" className="btn btn-outline-secondary" onClick={onClickAdd} ><i className="icofont-plus text-success"></i></button>
                    </div>
                </div>
                <div className="flex-grow-1">
                    {
                        data?.map((pos, i) => {
                            return <div key={"cuhdus" + i} className="py-2 d-flex align-items-center border-bottom">
                                <div className="d-flex ms-3 align-items-center flex-fill">
                                    <div className=" d-flex flex-column ps-3">
                                        <h6 className="fw-bold mb-0 small-14">{pos?.name}</h6>
                                    </div>
                                </div>
                                <button type="button" disabled={pos?.name === "Store Manager" || pos?.name === "Full-time"} className={`btn light-danger-bg text-end`} onClick={(e)=>onClickDelete(pos?.id)} >Delete</button>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}


export default TypeAndPositionCard;