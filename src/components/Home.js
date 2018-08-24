import React, { Component } from "react";
import firebase from "../server/firebase";
import { bindActionCreators } from "redux";
import { blogActions } from "../actions/blogActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Input,
  FormGroup,
  Label,
  ModalHeader,
  Modal,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { authActions } from "../actions/authActions";

class Home extends Component {
  constructor() {
    super();

    this.state = {
      modal: false,
      blog_title: "",
      blog_url: "",
      alert: ""
    };

    this.create_blog = this.create_blog.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeEvent = this.changeEvent.bind(this);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
        this.props.blog_actions.get_blogs();
      } else {
        this.setState({ user: null });
      }
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.blogs !== state.blogs) return { blogs: props.blogs };
    return null;
  }

  create_blog() {
    if (/\s/.test(this.state.blog_url)) {
      this.setState({ alert: "You cannot have spaces in your blog url!" });
      return;
    }

    if (
      this.state.blog_url.length === 0 ||
      this.state.blog_title.length === 0
    ) {
      this.setState({ alert: "Both fields are required." });
      return;
    }

    this.props.blog_actions.new_blog(
      this.state.blog_title,
      this.state.blog_url
    );
    //this.toggle();
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  changeEvent(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <div name="newBlogModal">
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>Create New Blog</ModalHeader>
            <ModalBody>
              {this.state.alert !== "" ? (
                <Alert color="danger">{this.state.alert}</Alert>
              ) : null}
              <FormGroup>
                <Label for="blog_title">Blog Name</Label>
                <Input
                  placeholder="John's Blog"
                  type="text"
                  name="blog_title"
                  onChange={this.changeEvent}
                />
              </FormGroup>
              <FormGroup>
                <Label for="blog_url">Blog URL</Label>
                <Input
                  placeholder="johns_blog"
                  type="text"
                  name="blog_url"
                  onChange={this.changeEvent}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.create_blog}>
                Create Blog
              </Button>{" "}
              <Button color="secondary" onClick={this.toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div name="blogs">
        <h1 style={{marginTop: "0.5em", marginBottom: "0.5em"}}> Your Blogs </h1>
          {this.props.blogs !== undefined
            ? this.props.blogs.map((blog, index) => (
                <Card key={index}>
                  <CardBody>
                    <h2>
                      <a href={blog.blog_url}>{blog.blog_title}</a>
                    </h2>
                  </CardBody>
                </Card>
              ))
            : null}

          <ButtonGroup style={{ marginTop: "0.5em"}}>
            <Button onClick={this.toggle}>Create New Blog</Button>
            <Button onClick={this.props.auth_actions.logout}>Logout</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    blog_actions: bindActionCreators(blogActions, dispatch),
    auth_actions: bindActionCreators(authActions, dispatch)
  };
}

function mapStateToProps(state, ownProps) {
  return {
    blogs: state.blogReducer.blogs
  };
}

const connectedHome = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);

export default connectedHome;
