import React from "react";

function BrandTimeFrame(props) {
  const {

    list,
    onClickAdd,
    handleEditClick,

  } = props;
  return (
    <div className="card mb-3">
      <div className="card-header py-3">
        <div className="d-flex align-items-center justify-content-between ">
          <div className="lesson_name">
            <h6 className="mb-0 fw-bold text-danger ">Time Frame</h6>
          </div>
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClickAdd}
            >
              <i className="icofont-plus text-success"></i>
            </button>
          </div>
        </div>
      </div>
      <ul className="list-unstyled mb-0">
        {list?.map((item, index) => {
          return (
            <li
              key={"dgfcs" + index}
              className="row flex-wrap mb-3"
            >
              <div className="py-2 d-flex align-items-center border-bottom">
                <div className="px-4 col-9">
                  <span className="fw-bold">{item?.name}</span>
                </div>
                <div className="col-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary fs-10"
                    onClick={() => handleEditClick(item?.id)}
                  >
                    <i className="icofont-eye text-success"></i>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BrandTimeFrame;
