import React, { Component } from "react";
import firebase from "../server/firebase";
import { bindActionCreators } from "redux";
import { blogActions } from "../actions/blogActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Button, Card, CardBody } from "reactstrap";

let fakedata = {
  blogs: [
    {
      blog_name: "John's Blog",
      link: "/john_blog",
      blog_posts: []
    },
    {
      blog_name: "Test blog",
      link: "/test"
    }
  ]
};
class Home extends Component {
  constructor() {
    super();

    this.create_blog = this.create_blog.bind(this);
  }

  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
        this.props.actions.get_blogs();
      } else {
        this.setState({ user: null });
      }
    });
  }

  create_blog() {
    this.props.actions.new_blog("blog_link", "blog title");
  }

  render() {

    return (
      <div name="blogs">
      { this.props.blogs !== undefined ? this.props.blogs.map((blog, index) => (
          <Card key={index}>
              <CardBody>
                  <h1><a href={blog.blog_link}>{blog.blog_title}</a></h1>
            </CardBody>
        </Card>

      )) : null}
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
