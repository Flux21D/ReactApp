import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {Router, browserHistory} from "react-router";
import routes from "./routes";
import store from "./utils/store";
require('es6-promise').polyfill();
import axios from "axios";

// Render the main component into the dom
ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes}/>
    </Provider>,
    document.getElementById('app')
);