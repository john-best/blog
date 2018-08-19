import * as types from "./actionTypes";
import "firebase/firestore";
import "firebase/auth";
import firebase from "../server/firebase";
import history from "../history";

export const blogActions = { new_blog, get_blogs, check_edit_privs };

let db = firebase.firestore();
let auth = firebase.auth();

function new_blog(blog_url, blog_title) {
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

function check_edit_privs(blog_id) {
  return dispatch => {
    dispatch(request())

    
    if (auth.currentUser === null) {
      dispatch(success(false));
      return;
    }
    let user_ref = db.collection("users").doc(auth.currentUser.uid);
    user_ref.get().then(doc => {
      let data = doc.data();

      // if blog is within user's created blogs array
      if (data.blogs.indexOf(blog_id) !== -1) {
        dispatch(success(true));
      } else {
        dispatch(success(false));
      }

    }).catch(error => {
      dispatch(failure(error));
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