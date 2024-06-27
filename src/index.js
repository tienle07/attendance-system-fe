import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./assets/scss/main.scss";
import axios from "axios";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import BorderSpinner from "./components/UI/BorderSpinner";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

axios.defaults.baseURL = "https://staras-api.smjle.xyz";
// axios.defaults.headers.common['Content-Type'] ='application/json';
// axios.defaults.headers.common['preflightContinue'] =true;
// axios.defaults.headers.common['Access-Control-Max-Age'] = 86400;
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, DELETE, PUT';
// axios.defaults.headers.common['Access-Control-Allow-Heeaders'] = 'Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization,append,delete,entries,foreach,get,has,keys,set,values';
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={<BorderSpinner />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
