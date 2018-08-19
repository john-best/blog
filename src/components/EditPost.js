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
import { connect } from "react-redux";
import { withRouter } from "react-router";
import firebase from "../server/firebase";

import marked from "marked";

class EditPost extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      body: "",
      preview: false,
      preview_title: "",
      preview_body: ""
    };

    this.changeEvent = this.changeEvent.bind(this);
    this.edit = this.edit.bind(this);
    this.preview = this.preview.bind(this);
    this.delete = this.delete.bind(this);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.setState({user: user})
        } else {
            this.props.history.push("/login");
        }
      });
  }

  componentDidMount() {
    this.props.actions.get_blog_post(
        this.props.match.params.blog_url,
        this.props.match.params.post_id
      );
  }

  static getDerivedStateFromProps(props, state) {
    if (props.post !== state.post) return { post: props.post, title: props.post.title, body: props.post.body };
    return null;
  }

  changeEvent(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  edit() {
    this.props.actions.edit_post(this.props.match.params.blog_url, this.props.match.params.post_id, this.state.title, this.state.body);
  }

  delete() {
      this.props.actions.delete_post(this.props.match.params.blog_url, this.props.match.params.post_id);
  }

  preview() {
      this.setState({preview: true, preview_title: this.state.title, preview_body: this.state.body})
  }

  render() {
    return (
      <Container>
        <Form>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              value={this.state.title}
              name="title"
              id="title"
              type="text"
              onChange={this.changeEvent}
            />
          </FormGroup>
          <FormGroup>
            <Label for="body">Body</Label>
            <Input
              value={this.state.body}
              name="body"
              id="body"
              type="textarea"
              onChange={this.changeEvent}
              style={{minHeight: "25em"}}
            />
          </FormGroup>
          <Button
            style={{ marginRight: "0.25%", marginTop: "2%" }}
            onClick={this.edit}
          >
            Save Changes
          </Button>
          <Button
            style={{ marginRight: "0.125%", marginLeft: "0.125%", marginTop: "2%" }}
          onClick={this.preview}>
            Preview
          </Button>
          <Button
            style={{ marginLeft: "0.25%", marginTop: "2%" }}
            onClick={this.delete} color="danger"
          >Delete Post</Button>
        </Form>

        {this.state.preview ? (
            <Card>
            <CardBody>
                <div>
                <span dangerouslySetInnerHTML={{ __html: marked(this.state.preview_body, {sanitize: true})}} />
                </div>
                </CardBody>
            </Card>
    )
        :(null)}
      </Container>
    );
  }
}

function mapStateToProps(state, ownProps) {
    console.log(state);
    return {
      post: state.postReducer.post
    };
  }

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(postActions, dispatch)
  };
}

const connectedEditPost = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(EditPost)
);
export default connectedEditPost;
