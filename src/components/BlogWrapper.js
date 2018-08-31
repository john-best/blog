import React, { Component } from "react";
import { Navbar, NavbarBrand, NavLink, Nav, NavItem, Container } from "reactstrap";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { authActions } from "../actions/authActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import firebase from "../server/firebase";

class BlogWrapper extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
    }
    
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });

    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.actions.logout()
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

            <Nav className="ml-auto" navbar>
              <NavItem>
                {this.state.user !== null ? <NavLink tag={Link} to={"/logout"} >Logout</NavLink> : <NavLink tag={Link} to={"/login"}>Login</NavLink>}
              </NavItem>
            </Nav>
          </Navbar>
          <this.props.rendering user={this.state.user} />
        </Container>
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(authActions, dispatch),
  };
}

const connectedBlogWrapper = withRouter(
  connect(
    null,
    mapDispatchToProps
  )(BlogWrapper)
);
export default connectedBlogWrapper;
