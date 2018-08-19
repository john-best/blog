import * as types from "./actionTypes";
import "firebase/firestore";
import "firebase/auth";
import firebase from "../server/firebase";
import history from "../history";

let auth = firebase.auth();
let db = firebase.firestore();

export const postActions = { new_post, get_blog_posts };

function new_post(blog_url, title, content) {
  return dispatch => {
    dispatch(request());

    db.collection("posts")
      .add({
        title: title,
        body: content,
      })
      .then(post => {
        console.log(post.id);

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
      }).catch(error => {
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

    blog_ref.get().then(doc => {
      let data = doc.data();
      let posts = [];
      let promises = [];

      for (var i = 0; i < data.posts.length; i++) {
        let post_ref = db.collection("posts").doc(data.posts[i]);
        let post_id = data.posts[i];

        promises.push(post_ref.get().then(doc => {
          let post = doc.data();
          posts.push({
            title: post.title,
            body: post.body,
            id: post_id
          });
        }))
      }


      Promise.all(promises).then(() => {
        dispatch(success(posts));
      })
    }).catch(error => {
      dispatch(failure(error));
    });;
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

}
