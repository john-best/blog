import * as types from "./actionTypes";
import "firebase/database";
import "firebase/auth";
import firebase from "../server/firebase";


let auth = firebase.auth();
let db = firebase.database();

export const postActions = { new_post };

function new_post(userid, title, content) {
    return dispatch => {
        dispatch(request())

    }

    function request() {
        return { type: types.NEW_POST_REQUEST };
      }
    
      function success() {
        return { type: types.NEW_POST_SUCCESS };
      }
    
      function failure(error) {
        return { type: types.NEW_POST_FAILURE, error: error };
      }

}