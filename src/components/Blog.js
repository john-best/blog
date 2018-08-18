import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";


class Blog extends Component {
    constructor() {
        super()

    }

    componentDidMount() {

        // render blog posts here

    }

    render() {
        return "Loading...";
    }
}

  function mapStateToProps(state, ownProps) {
    return {}
  }
  
  const connectedBlog = withRouter(
    connect(
      mapStateToProps,
      null
    )(Blog)
  );
  
  export default connectedBlog;
  