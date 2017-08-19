import React from "react";
import {Route, IndexRoute} from "react-router";

import AppComponent from "./app.component";
import LoginComponent from "./components/login/login.component";

export default (
    <Route path ="/" component={AppComponent}>
        <IndexRoute component={LoginComponent}/>
    </Route>
)