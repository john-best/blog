import React, { Component } from "react";
import firebase from "../server/firebase";
import { bindActionCreators } from "redux";
import { blogActions } from "../actions/blogActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  Button,
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

class Home extends Component {
  constructor() {
    super();

    this.state = {
      modal: false,
      blog_link: "",
      blog_name: ""
    };

    this.create_blog = this.create_blog.bind(this);
    this.toggle = this.toggle.bind(this);
    this.changeEvent = this.changeEvent.bind(this);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
        this.props.actions.get_blogs();
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
    this.props.actions.new_blog(this.state.blog_link, this.state.blog_name);
    this.toggle();
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
            <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="blog_name">Blog Name</Label>
                <Input
                  placeholder="John's Blog"
                  type="text"
                  name="blog_name"
                  onChange={this.changeEvent}
                />
              </FormGroup>
              <FormGroup>
                <Label for="blog_link">Blog URL</Label>
                <Input
                  placeholder="johns_blog"
                  type="text"
                  name="blog_link"
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
          {this.props.blogs !== undefined
            ? this.props.blogs.map((blog, index) => (
                <Card key={index}>
                  <CardBody>
                    <h1>
                      <a href={blog.blog_link}>{blog.blog_title}</a>
                    </h1>
                  </CardBody>
                </Card>
              ))
            : null}

          <Button onClick={this.toggle}>Create New Blog</Button>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(blogActions, dispatch)
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
