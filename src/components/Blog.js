import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { postActions } from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import { Button, Card, CardHeader, CardBody } from "reactstrap";
import marked from "marked";
import firebase from "../server/firebase";

class Blog extends Component {
  constructor() {
    super();

    this.state = {}

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  componentDidMount() {
    this.props.actions.get_blog_posts(this.props.match.params.blog_url);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.posts !== state.posts) return { posts: props.posts };
    return null;
  }

  render() {
    return (
      <div>
        <div name="posts">
          {this.state.posts === undefined
            ? "Loading..."
            : this.state.posts.map((item, index) => (
                <Card key={index} style={{ marginBottom: "2em" }}>
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
                    <p><i>Posted on {item.posted_at}</i></p>
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

        {this.state.user !== null ? (
          <div name="buttons">
            <Link to={"/" + this.props.match.params.blog_url + "/new"}>
              <Button>New Post</Button>
            </Link>

            <Link to={"/"}>
              <Button>Dashboard</Button>
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    posts: state.postReducer.posts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(postActions, dispatch)
  };
}

const connectedBlog = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Blog)
);

export default connectedBlog;
