import React, { Component } from "react";
import { Route, Router, Switch } from "react-router";

import Home from "./Home";
import Login from "./Login";
import NewPost from "./NewPost";
import Blog from "./Blog";
import history from "../history";
import Post from "./Post";
import EditPost from "./EditPost";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/:blog_url/new" component={NewPost} />
            <Route exact path="/:blog_url" component={Blog} />
            <Route exact path="/:blog_url/post/:post_id" component={Post} />
            <Route exact path="/:blog_url/post/:post_id/edit" component={EditPost} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
