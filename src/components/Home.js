import React, { Component } from "react";
import firebase from "../server/firebase";

class Home extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return <h1> Help </h1>;
  }
}

export default Home;
