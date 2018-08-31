import React, { Component } from "react";
import { Route, Router, Switch } from "react-router";

import Home from "./Home";
import Login from "./Login";
import NewPost from "./NewPost";
import Blog from "./Blog";
import history from "../history";
import Post from "./Post";
import EditPost from "./EditPost";
import BlogWrapper from "./BlogWrapper";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route exact path="/" render={props => <BlogWrapper {...props} rendering={Home} />} />
            <Route exact path="/login" render={props => <Login {...props} isLogout={false} />} />
            <Route exact path="/logout" render={props => <Login {...props} isLogout={true} />} />
            <Route exact path="/:blog_url/new" render={props => <BlogWrapper {...props} rendering={NewPost} />} />
            <Route exact path="/:blog_url" render={props => <BlogWrapper {...props} rendering={Blog} />} />
            <Route exact path="/:blog_url/post/:post_id" render={props => <BlogWrapper {...props} rendering={Post} />} />
            <Route exact path="/:blog_url/post/:post_id/edit" render={props => <BlogWrapper {...props} rendering={EditPost} />} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
