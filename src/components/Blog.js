import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { postActions } from "../actions/postActions";
import { blogActions } from "../actions/blogActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import { Button, Card, CardHeader, CardBody } from "reactstrap";
import marked from "marked";
import firebase from "../server/firebase";

class Blog extends Component {
  constructor() {
    super();

    this.state = {};

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
        this.props.blogActions.check_edit_privs(
          this.props.match.params.blog_url
        );
      } else {
        this.setState({ user: null });
        this.props.blogActions.check_edit_privs(
          this.props.match.params.blog_url
        );
      }
    });
  }

  componentDidMount() {
    this.props.actions.get_blog_posts(this.props.match.params.blog_url);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.posts !== state.posts) return { posts: props.posts };
    if (props.user_can_edit !== state.user_can_edit)
      return { user_can_edit: props.user_can_edit };
    return null;
  }

  render() {
    return (
      <div>
        <div name="posts">
          {this.state.posts === undefined
            ? "Loading..."
            : this.state.posts.map((item, index) => (
                <Card key={index} style={{ marginBottom: "0.5em", marginTop: "0.5em" }}>
                  <CardHeader>
                    <Link
                      to={
                        "/" +
                        this.props.match.params.blog_url +
                        "/post/" +
                        item.id
                      }
                    >
                      <h3>{item.title}</h3>
                    </Link>
                    <p>
                      <i>Posted on {item.posted_at}</i>
                    </p>
                  </CardHeader>
                  <CardBody>
                    <div>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: marked(item.body, { sanitize: true })
                        }}
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
        </div>
        {this.props.user_can_edit === true ? (
          <Link to={"/" + this.props.match.params.blog_url + "/new"}>
            <Button>New Post</Button>
          </Link>
        ) : null}
        <Link to={"/"}>
          <Button>Dashboard</Button>
        </Link>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  console.log(state);
  return {
    posts: state.postReducer.posts,
    user_can_edit: state.blogReducer.user_can_edit
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(postActions, dispatch),
    blogActions: bindActionCreators(blogActions, dispatch)
  };
}

const connectedBlog = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Blog)
);

export default connectedBlog;
