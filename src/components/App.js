import React, { Component } from "react";
import { Route, Router, Switch } from "react-router";

import Home from "./Home";
import Login from "./Login";
import NewPost from "./NewPost";
import Blog from "./Blog";
import history from "../history";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/:blog_name/newpost" component={NewPost} />
            <Route exact path="/:blog_name" component={Blog} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
