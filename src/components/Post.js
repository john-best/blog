import React, { Component } from "react";
import firebase from "../server/firebase";
import { bindActionCreators } from "redux";
import { postActions } from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Button, Card, CardHeader, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import marked from "marked";
class Post extends Component {
  constructor() {
    super();

    this.state = {};

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }
  componentDidMount() {
    console.log(this.props.match);
    this.props.actions.get_blog_post(
      this.props.match.params.blog_url,
      this.props.match.params.post_id
    );
  }

  static getDerivedStateFromProps(props, state) {
    if (props.post !== state.post) return { post: props.post };
    return null;
  }

  render() {
    let post =
      this.props.post !== undefined ? (
        <Card style={{marginTop: "0.5em", marginBottom: "0.5em"}}>
          <CardHeader>
            <Link
              to={
                "/" +
                this.props.match.params.blog_url +
                "/post/" +
                this.props.post.id
              }
            >
              <h3>{this.props.post.title}</h3>
            </Link>
            <p>
              <i>Posted on {this.props.post.posted_at}</i>
            </p>
          </CardHeader>
          <CardBody>
            <div>
              <span
                dangerouslySetInnerHTML={{
                  __html: marked(this.props.post.body, { sanitize: true })
                }}
              />
            </div>
          </CardBody>
        </Card>
      ) : null;
    return (
      <div>
        <div name="post">{post}</div>

        <Link to={"/" + this.props.match.params.blog_url}>
          <Button>Blog Main</Button>
        </Link>

        {this.state.user !== null ? (
          <Link to={this.props.match.url + "/edit"}>
            <Button>Edit Post</Button>
          </Link>
        ) : null}
      </div>
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

const connectedPost = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Post)
);
export default connectedPost;
