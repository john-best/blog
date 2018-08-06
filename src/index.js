import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./components/registerServiceWorker";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from "react-redux";
import { Router } from "react-router-dom";

import firebase from "./server/firebase";

import routes from "./routes";
import history from "./history";

import configureStore from "./store";
const store = configureStore();


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App routes={routes} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
