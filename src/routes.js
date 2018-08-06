import React from "react";
import { Route, Switch } from "react-router";

import Home from "./components/Home";
import Login from "./components/Login";

export default (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/login" component={Login} />
  </Switch>
);
