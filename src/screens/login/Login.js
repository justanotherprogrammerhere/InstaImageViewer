import * as React from "react";
import {
  Card,
  FormControl,
  Input,
  InputLabel,
  Button
} from "@material-ui/core";
import Header from "../../common/Header";
import "./Login.css";
import properties from "../../common/Properties";

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      validateCredentials: true,
      emptyUsername: false,
      emptyPassword: false
    };
  }
  handleEvent(e, type) {
    const value = e.target.value;
    const nextState = {};
    nextState[type] = value;
    this.setState(nextState);
  }
  handleClick = () => {
    const user = properties.username;
    const pwd = properties.password;
    const { username, password } = this.state;
    if (username !== "" || password !== "") {
      this.setState({
        emptyUsername: false,
        emptyPassword: false,
        validateCredentials: true
      });
      if (username === "") {
        this.setState({ emptyUsername: true });
        return;
      }
      if (password === "") {
        this.setState({ emptyPassword: true });
        return;
      }
    } else {
      this.setState({ emptyUsername: true, emptyPassword: true });
      return;
    }
    if (username === user && password === pwd) {
      this.setState({ validateCredentials: true });
      sessionStorage.setItem(
        "accessToken",
          properties.accessToken
      );
      window.location = "/home";
    } else {
      this.setState({ validateCredentials: false });
    }
  };
  render() {
    const { validateCredentials, emptyUsername, emptyPassword } = this.state;
    return (
      <div className="login-wrapper">
        <Card className="login-hoarding">
          <h3 className="login-heading">LOGIN</h3>
          <FormControl fullWidth={true} margin="normal">
            <InputLabel htmlFor="username">Username *</InputLabel>
            <Input
              id="username"
              onChange={e => this.handleEvent(e, "username")}
            />
            {emptyUsername ? <span className="error">required</span> : null}
          </FormControl>
          <FormControl fullWidth={true} margin="normal">
            <InputLabel htmlFor="password">Password *</InputLabel>
            <Input
              id="password"
              type="password"
              onChange={e => this.handleEvent(e, "password")}
            />
            {emptyPassword ? <span className="error">required</span> : null}
            {!validateCredentials ? (
              <span className="error">Incorrect username and/or password</span>
            ) : null}
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            className="login-button in1"
            onClick={this.handleClick}
          >
            LOGIN
          </Button>
        </Card>
      </div>
    );
  }
}
