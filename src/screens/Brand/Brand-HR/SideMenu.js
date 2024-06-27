import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function SideMenu(props) {
  const { setSelectedTab } = props;
  const [scrollPosition, setScrollPosition] = useState(0);
  const user = useSelector((state) => state.auth?.login?.currentUser);
  const employeeList = useSelector(
    (state) =>
      state.branchs?.currentBranchSelect?.curBranch
        ?.employeeInStoreResponseModels
  )?.filter((e) => e.positionId !== 1 && e.status !== -1);
  const [activeChatIndex, setActiveChatIndex] = useState(0);
  const [txtMessage, setTxtMessage] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      console.log(window.scrollY)
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  //   useEffect(() => {
  //     setSelectedTab(employeeList && employeeList[0].employeeId);
  //   }, []);
  const menuList = [
    { id: 1, logo: "icofont-edit", name: "Brand Information" },
    { id: 2, logo: "icofont-eye", name: "Type & Position" },
    { id: 3, logo: "icofont-edit", name: "TimeFrame & Setting" },
    // { id: 4, logo: "icofont-edit", name: "Config" },
  ];
  function tabEvents(e, id) {
    e.preventDefault();
    document.getElementById("tab1").classList.remove("active");
    // document.getElementById("tab2").classList.remove("active");
    document.getElementById("tab3").classList.remove("active");
    document.getElementById("tab" + id).classList.add("active");

    document.getElementById("tab-conatain1").classList.remove("active");
    document.getElementById("tab-conatain1").classList.add("show");
    document.getElementById("tab-conatain2").classList.remove("active");
    document.getElementById("tab-conatain2").classList.add("show");
    document.getElementById("tab-conatain3").classList.remove("active");
    document.getElementById("tab-conatain3").classList.add("show");
    document.getElementById("tab-conatain" + id).classList.add("active");
    document.getElementById("tab-conatain" + id).classList.add("show");
  }
  return (
    <div
      id="chatMenuList"
      className={`sidemenu border-left border-top-0 border-bottom-1 order-1 w380`}
      style={{ transform: `translateX(${scrollPosition}px)` }}
    >
      <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
        {menuList?.map((d, i) => {
          return (
            <li
              key={"545" + i}
              className={`list-group-item px-md-4 py-3 py-md-4 ${
                activeChatIndex === i ? "open active" : ""
              }`}
            >
              <a
                href="#!"
                className="d-flex"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveChatIndex(i);
                  setSelectedTab(d);
                }}
              >
                {/* <i className={`${d.logo} text-success`} /> */}
                <div className="flex-fill ms-3 d-flex flex-column ps-2 text-truncate">
                  <h6 className="d-flex justify-content-between align-items-center mb-0">
                    <span>{d.name}</span>{" "}
                    {/* <small className="msg-time">{d.positionName}</small> */}
                  </h6>
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SideMenu;
