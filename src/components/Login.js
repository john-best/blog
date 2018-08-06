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

class Login extends Component {
  render() {
    return (
        <Container>
        <Card body className="text-center">
          <CardHeader><span style={{fontSize: '200%'}}>Login</span></CardHeader>
          <CardBody style={{paddingBottom: 0}}>
            <InputGroup>
            <Input placeholder="Email" />
            </InputGroup>
            <InputGroup>
            <Input placeholder="Password" />
            </InputGroup>
            <Button style={{marginRight: '0.25%', marginTop: '2%'}}>
              Login
            </Button>
            <Button style={{marginLeft: '0.25%', marginTop: '2%'}}>
              Register
            </Button>
          </CardBody>
          </Card>
          </Container>
    )
  }
}

export default Login;
