import * as types from "./actionTypes";
import firebase from "../server/firebase";
import "firebase/auth";

import history from "../history";

export const authActions = { login, register };

let auth = firebase.auth();

function login(email, password) {
  return dispatch => {
    dispatch(request());

    auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        console.log(result);
        dispatch(success());
        history.push("/")
      })
      .catch(error => {
        console.log(error);
        dispatch(failure(error));
      });
  };

  function request() {
    return { type: types.LOGIN_REQUEST };
  }

  function success() {
    return { type: types.LOGIN_SUCCESS };
  }

  function failure(error) {
    return { type: types.LOGIN_FAILURE, error: error };
  }
}

function register(email, password) {
  return dispatch => {

    dispatch(request());
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        console.log(result);
        dispatch(success());
      })
      .catch(error => {
        console.log(error);
        dispatch(failure(error));
      });
  };

  function request() {
    return { type: types.REGISTER_REQUEST };
  }

  function success() {
    return { type: types.REGISTER_SUCCESS };
  }

  function failure(error) {
    return { type: types.REGISTER_FAILURE, error: error };
  }
}
