import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { postActions } from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import { Card, CardHeader, CardBody } from "reactstrap";
import marked from "marked";

class Blog extends Component {
  constructor() {
    super();

    this.state = {}
  }

  componentDidMount() {
    this.props.actions.get_blog_posts(this.props.match.params.blog_url);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.posts !== state.posts) return { posts: props.posts };
    return null;
}

  render() {

    console.log(this.state.posts)
    return (
      <div>
        <div name="posts">
          {this.state.posts === undefined
            ? "Loading..."
            : this.state.posts.map((item, index) => (
                <Card key={index} style={{marginBottom: "2em"}}>
                  <CardHeader><Link to={"/" + this.props.match.params.blog_url + "/post/" + item.id}><h3>{item.title}</h3></Link></CardHeader>
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
