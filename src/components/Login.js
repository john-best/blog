import React, { Component } from "react";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  InputGroup,
  Input
} from "reactstrap";
import { bindActionCreators } from "redux";
import { authActions } from "../actions/authActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import firebase from "../server/firebase";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: ""
    };

    this.changeEvent = this.changeEvent.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push("/");
      }
    });
  }

  changeEvent(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onKeyPress(e) {
    if (e.keyCode === 13) {
      this.login();
    }
  }

  login() {
    this.props.actions.login(this.state.email, this.state.password);
  }

  register() {
    this.props.actions.register(this.state.email, this.state.password);
    // TODO: new modal for registration to confirm password and other requirements...
  }

  render() {
    return (
      <Container>
        <Card body className="text-center">
          <CardHeader>
            <span style={{ fontSize: "200%" }}>Login</span>
          </CardHeader>
          <CardBody style={{ paddingBottom: 0 }}>
            <InputGroup>
              <Input
                placeholder="Email"
                name="email"
                type="email"
                onChange={this.changeEvent}
                onKeyDown={this.onKeyPress}
              />
            </InputGroup>
            <InputGroup>
              <Input
                placeholder="Password"
                name="password"
                type="password"
                onChange={this.changeEvent}
                onKeyDown={this.onKeyPress}
              />
            </InputGroup>
            <Button
              style={{ marginRight: "0.25%", marginTop: "2%" }}
              onClick={this.login}
            >
              Login
            </Button>
            <Button
              style={{ marginLeft: "0.25%", marginTop: "2%" }}
              onClick={this.register}
            >
              Register
            </Button>
          </CardBody>
        </Card>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch)
  };
}

const connectedLogin = withRouter(
  connect(
    null,
    mapDispatchToProps
  )(Login)
);
export default connectedLogin;
