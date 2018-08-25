import * as types from "./actionTypes";
import firebase from "../server/firebase";
import "firebase/auth";
import "firebase/firestore";

import history from "../history";

export const authActions = { login, register, logout };

let auth = firebase.auth();
let db = firebase.firestore();

function login(email, password) {
  return dispatch => {
    dispatch(request());

    // firebase login w/ email+password
    auth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        dispatch(success());
        history.push("/");
      })
      .catch(error => {
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

    // firebase create w/ email+password
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(result => {
        db.collection("/users").doc(result.user.uid)
          .set({
            email: result.user.email,
          })
          .then(result => {
            dispatch(success());
          });
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

function logout() {
  return dispatch => {
    dispatch(request())
    auth
      .signOut()
      .then(() => {
        dispatch(success())
        history.push("/login");
      })
      .catch(error => {
        dispatch(failure(error));
      });
  };

  function request() {
    return { type: types.LOGOUT_REQUEST };
  }

  function success() {
    return { type: types.LOGOUT_SUCCESS };
  }

  function failure(error) {
    return { type: types.LOGOUT_FAILURE, error: error };
  }
}
