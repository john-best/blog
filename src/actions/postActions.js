import * as types from "./actionTypes";
import "firebase/firestore";
import "firebase/auth";
import firebase from "../server/firebase";
import history from "../history";

let auth = firebase.auth();
let db = firebase.firestore();

export const postActions = { new_post, get_blog_posts, get_blog_post, edit_post };

function new_post(blog_url, title, body) {
  return dispatch => {
    dispatch(request());

    db.collection("posts")
      .add({
        title: title,
        body: body,
        posted_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(post => {
        let blog_ref = db.collection("blogs").doc(blog_url);
        let userid = auth.currentUser.userid;

        // do we need to check if userid == blog creator??
        blog_ref
          .update({
            posts: firebase.firestore.FieldValue.arrayUnion(post.id)
          })
          .then(result => {
            dispatch(success());
            history.push("/" + blog_url + "/post/" + post.id);
          });
      })
      .catch(error => {
        dispatch(failure(error));
      });
  };

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

function get_blog_posts(blog_url) {
  return dispatch => {
    dispatch(request());

    let blog_ref = db.collection("blogs").doc(blog_url);

    blog_ref
      .get()
      .then(doc => {
        let data = doc.data();
        let posts = [];
        let promises = [];

        for (var i = data.posts.length - 1; i >= 0; i--) {
          let post_ref = db.collection("posts").doc(data.posts[i]);
          let post_id = data.posts[i];

          promises.push(
            post_ref.get().then(doc => {
              let post = doc.data();
              posts.push({
                ...post,
                posted_at: post.posted_at.toDate().toString(),
                id: post_id
              });
            })
          );
        }

        Promise.all(promises).then(() => {
          dispatch(success(posts));
        });
      })
      .catch(error => {
        dispatch(failure(error));
      });
  };

  function request() {
    return { type: types.GET_POSTS_REQUEST };
  }

  function success(posts) {
    return { type: types.GET_POSTS_SUCCESS, posts: posts };
  }

  function failure(error) {
    return { type: types.GET_POSTS_FAILURE, error: error };
  }
}

function get_blog_post(blog_url, post_id) {
  return dispatch => {
    dispatch(request());

    let post_ref = db.collection("posts").doc(post_id);
    post_ref
      .get()
      .then(doc => {

        let post = doc.data();

        let returnval = {
          
        }
        dispatch(success({
          ...post,
          posted_at: post.posted_at.toDate().toString(),
          id: post_id
        }));
      })
      .catch(error => {
        dispatch(failure(error));
      });
  };

  function request() {
    return { type: types.GET_POST_REQUEST };
  }

  function success(post) {
    return { type: types.GET_POST_SUCCESS, post: post };
  }

  function failure(error) {
    return { type: types.GET_POST_FAILURE, error: error };
  }
}

function edit_post(blog_url, post_id, title, body) {
  return dispatch => {
    dispatch(request())

    console.log(post_id);
    let post_ref = db.collection("posts").doc(post_id);
    post_ref.update({
      title: title,
      body: body,
      updated_at: firebase.firestore.FieldValue.arrayUnion(post_id)
    }).then(result => {
      dispatch(success());
      history.push("/" + blog_url + "/post/" + post_id);
    }).catch(error => {

      console.log(error);
      dispatch(failure(error));
    })
  }
  function request() {
    return { type: types.EDIT_POST_REQUEST };
  }

  function success() {
    return { type: types.EDIT_POST_SUCCESS };
  }

  function failure(error) {
    return { type: types.EDIT_POST_FAILURE, error: error };
  }

}