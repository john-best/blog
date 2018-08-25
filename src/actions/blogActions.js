import * as types from "./actionTypes";
import "firebase/firestore";
import "firebase/auth";
import firebase from "../server/firebase";
import history from "../history";

export const blogActions = { new_blog, get_blogs, get_blog_settings, check_edit_privs_redirect };

let db = firebase.firestore();
let auth = firebase.auth();

function new_blog(blog_title, blog_url) {
  return dispatch => {
    dispatch(request());

    // add a new blog to the blog collection
    // then add the blog link (which is unique key) to the array of blogs for the user
    // since the blog creation is now finished, push them to the newly created blog page
    db.collection("blogs")
      .doc(blog_url)
      .set({
        blog_title: blog_title,
        creator: auth.currentUser.uid,
        posts: [],
        created_at: firebase.firestore.FieldValue.serverTimestamp()
      })
      .then(result => {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            blogs: firebase.firestore.FieldValue.arrayUnion(blog_url)
          })
          .then(result => {
            dispatch(success());
            history.push("/" + blog_url);
          });
      })
      .catch(error => {
        console.log(error);
        dispatch(failure(error));
      });
  };

  function request() {
    return { type: types.NEW_BLOG_REQUEST };
  }

  function success() {
    return { type: types.NEW_BLOG_SUCCESS };
  }

  function failure(error) {
    return { type: types.NEW_BLOG_FAILURE, error: error };
  }
}

function get_blogs() {
  return dispatch => {
    dispatch(request());

    let user_ref = db.collection("users").doc(auth.currentUser.uid);
    let my_blogs = [];

    // grab the array of blog urls from the user
    // then grab the title from the blog
    // then combine those for each blog the user has
    user_ref
      .get()
      .then(doc => {
        if (doc.exists) {
          let data = doc.data();
          let promises = [];

          if (data.blogs === undefined) {
            throw "No blogs found"
          }

          for (var i = 0; i < data.blogs.length; i++) {
            let blog_ref = db.collection("blogs").doc(data.blogs[i]);

            let blog_url = data.blogs[i];
            promises.push(
              blog_ref.get().then(doc => {
                my_blogs.push({
                  blog_url: blog_url,
                  blog_title: doc.data().blog_title
                });
              })
            );
          }

          Promise.all(promises).then(() => {
            dispatch(success(my_blogs));
          });
        } else {
          throw "This user could not be found.";
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(failure(error))
      });
  };

  function request() {
    return { type: types.GET_BLOGS_REQUEST };
  }

  function success(blogs) {
    return { type: types.GET_BLOGS_SUCCESS, blogs: blogs };
  }

  function failure(error) {
    return { type: types.GET_BLOGS_FAILURE, error: error };
  }
}

function get_blog_settings(blog_id) {
  return dispatch => {
    dispatch(request())

    // get blog settings
    // right now: the blog name and if the user is the blog creator
    if (auth.currentUser === null) {
      dispatch(success(false));
      return;
    }
    let blog_ref = db.collection("blogs").doc(blog_id);
    blog_ref.get().then(doc => {
      let data = doc.data();

      // if the blog owner is the current user...
      if (data.creator === auth.currentUser.uid) {
        dispatch(success(true, data.blog_title));
      } else {
        dispatch(success(false, data.blog_title));
      }

    }).catch(error => {
      dispatch(failure(error));
    })

  }

  function request() {
    return { type: types.CHECK_EDIT_PRIVS_REQUEST };
  }

  function success(bool, blog_name) {
    return { type: types.CHECK_EDIT_PRIVS_SUCCESS, user_can_edit: bool, blog_name: blog_name };
  }

  function failure(error) {
    // if there's an error let's just not let them edit
    return { type: types.CHECK_EDIT_PRIVS_FAILURE, user_can_edit: false, error: error, blog_name: "" };
  }
}

function check_edit_privs_redirect(user_id, blog_id) {
  return dispatch => {
    dispatch(request())

    // redirects you back a page if you do not have access to these pages
    let blog_ref = db.collection("blogs").doc(blog_id);
    blog_ref.get().then(doc => {
      let data = doc.data();

      if (data.creator === user_id) {
        dispatch(success(true));
      } else {
        dispatch(success(false));
        history.goBack();
      }

    }).catch(error => {
      dispatch(failure(error));
      history.goBack();
    })

  }

  function request() {
    return { type: types.CHECK_EDIT_PRIVS_REQUEST };
  }

  function success(bool) {
    return { type: types.CHECK_EDIT_PRIVS_SUCCESS, user_can_edit: bool };
  }

  function failure(error) {
    // if there's an error let's just not let them edit
    return { type: types.CHECK_EDIT_PRIVS_FAILURE, user_can_edit: false, error: error };
  }
}