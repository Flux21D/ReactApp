import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, browserHistory} from "react-router";
import routes from "./routes";
import store from "./utils/store";
require('es6-promise').polyfill();
import axios from "axios";

window.GLOBALS = {
  kalturaConfigs: {
    partnerId: "1759891",
    uiConfigId: "37835012"
  }
};

axios.interceptors.response.use(response => {
    // Do something with response data
  return response;
}, error => {
    // Do something with response error
  if (error.response.status === 401) {
    store.dispatch(logout());
    browserHistory.push("login");
  }

  return error;
});

// setAuthData();

// Render the main component into the dom
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes}/>
    </Provider>,
    document.getElementById('app')
);