import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./screens/login/Login";

ReactDOM.render(
  <Router>
    <Route exact path="/" component={Login} />
  </Router>,
  document.getElementById("root")
);
