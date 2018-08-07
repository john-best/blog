import React, { Component } from "react";
import firebase from "../server/firebase";

let fakedata = {
      postid: 1,
      title: "First post!",
      content: "this is probably a good spot for markdown",
      link: "/userid/postid",
      date: "somesortofdatetime"
};


class Post extends Component {
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  render() {
    return (
      <div name="posts">
        {fakedata.posts.map((item, index) => 
          <div key={"post-" + item.postid}>
            <h1>
              <a href={item.link}>{item.title}</a>
            </h1>
            <p>{item.content}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Post;
