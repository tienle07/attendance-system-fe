import React from "react";
import Sidebar from "./components/common/Sidebar";
import AuthIndex from "./screens/AuthIndex";
import MainIndex from "./screens/MainIndex";
import withRouter from "./withRouter";

function App(props) {
  function activekey() {
    var res = window.location.pathname
    var baseUrl = process.env.PUBLIC_URL
    baseUrl = baseUrl.split("/");
    res = res.split("/");
    res = res.length > 0 ? res[baseUrl.length] : "/";
    res = res ? "/" + res : "/";
    const activeKey1 = res;
    return activeKey1
  }

  if (activekey() === "/sign-in" || activekey() === "/timeout" || activekey() === "/forgot-password" || activekey() === "/unauthorized" || activekey() === "/page-404") {
    return (
      <div id="mytask-layout" className="theme-indigo">
        <AuthIndex/>
      </div>
    )
  }
  return (
    <div id="mytask-layout" className="theme-indigo">
      <Sidebar activekey={activekey()} history={props.history} />
      <MainIndex activekey={activekey()}></MainIndex>
    </div>
  );
}


export default withRouter(App);
