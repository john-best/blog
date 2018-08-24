import React, { Component } from "react";
import Home from "./Home";
import {
  Navbar,
  NavbarBrand,
} from "reactstrap";

import { Link } from "react-router-dom";

class BlogWrapper extends Component {
  constructor() {
    super();
  }

  render() {

    console.log(this.props.match.params)

    return (
      <div className="BlogWrapper">
      <Navbar color="light" light expand="md">
      <NavbarBrand tag={Link} to={this.props.match.params.post_id === undefined ? "/" : "/" + this.props.match.params.blog_url}>Blog(tm)</NavbarBrand>
      </Navbar>
        <this.props.rendering />
      </div>
    );
  }
}

export default BlogWrapper;
