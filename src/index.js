import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

ReactDOM.render(
  <Router>
    <Route exact path="/" component={Login} />
  </Router>,
  document.getElementById("root")
);
