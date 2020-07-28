import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./screens/login/Login";
import Home from "./screens/home/Home";

ReactDOM.render(
  <Router>
    <Route exact path="/" component={Login} />
    <Route exact path="/home" component={Home} />
  </Router>,
  document.getElementById("root")
);
