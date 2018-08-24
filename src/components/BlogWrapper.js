import React, { Component } from "react";
import Home from "./Home";
import { Navbar, NavbarBrand, Container } from "reactstrap";

import { Link } from "react-router-dom";

class BlogWrapper extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="BlogWrapper">
        <Container>
          <Navbar color="light" light expand="md">
            <NavbarBrand
              tag={Link}
              to={
                this.props.match.params.post_id === undefined
                  ? "/"
                  : "/" + this.props.match.params.blog_url
              }
            >
              Blog(tm)
            </NavbarBrand>
          </Navbar>
          <this.props.rendering />
        </Container>
      </div>
    );
  }
}

export default BlogWrapper;
