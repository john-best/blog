import React, { Component } from "react";

import {
  Button,
  Card,
  Form,
  FormGroup,
  Container,
  Label,
  InputGroup,
  Input,
  CardBody
} from "reactstrap";
import { bindActionCreators } from "redux";
import { postActions } from "../actions/postActions";
import { blogActions } from "../actions/blogActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import firebase from "../server/firebase";

import marked from "marked";

class NewPost extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      content: "",
      preview: false,
      preview_title: "",
      preview_content: ""
    };

    this.changeEvent = this.changeEvent.bind(this);
    this.post = this.post.bind(this);
    this.preview = this.preview.bind(this);

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({user: user})
        this.props.blogActions.check_edit_privs_redirect(user.uid, this.props.match.params.blog_url);
      } else {
        this.props.history.push("/login");
      }
    });
  }

  changeEvent(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  post() {
    this.props.actions.new_post(this.props.match.params.blog_url, this.state.title, this.state.content);
  }

  preview() {
      this.setState({preview: true, preview_title: this.state.title, preview_content: this.state.content})
  }

  render() {
    return (
      <Container>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              placeholder=""
              name="title"
              id="title"
              type="text"
              onChange={this.changeEvent}
            />
          </FormGroup>
          <FormGroup>
            <Label for="content">Body</Label>
            <Input
              placeholder=""
              name="content"
              id="content"
              type="textarea"
              onChange={this.changeEvent}
              style={{minHeight: "25em"}}
            />
          </FormGroup>
          <Button
            style={{ marginRight: "0.25%", marginTop: "2%" }}
            onClick={this.post}
          >
            Post
          </Button>
          <Button
            style={{ marginLeft: "0.25%", marginTop: "2%" }}
          onClick={this.preview}>
            Preview
          </Button>
        </Form>

        {this.state.preview ? (
            <Card>
            <CardBody>
                <div>
                <span dangerouslySetInnerHTML={{ __html: marked(this.state.preview_content, {sanitize: true})}} />
                </div>
                </CardBody>
            </Card>
    )
        :(null)}
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(postActions, dispatch),
    blogActions: bindActionCreators(blogActions, dispatch)
  };
}
const connectedNewPost = withRouter(
  connect(
    null,
    mapDispatchToProps
  )(NewPost)
);
export default connectedNewPost;
