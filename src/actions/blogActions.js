import * as types from "./actionTypes";
import "firebase/firestore";
import "firebase/auth";
import firebase from "../server/firebase";
import history from "../history";

export const blogActions = { new_blog, get_blogs };

let db = firebase.firestore();
let auth = firebase.auth();

function new_blog(blog_link, blog_title) {
  return dispatch => {
    dispatch(request());

    // add a new blog to the blog collection
    // then add the blog link (which is unique key) to the array of blogs for the user
    // since the blog creation is now finished, push them to the newly created blog page
    db.collection("blogs")
      .doc(blog_link)
      .set({
        blog_title: blog_title,
        creator: auth.currentUser.uid
      })
      .then(result => {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            blogs: firebase.firestore.FieldValue.arrayUnion(blog_link)
          })
          .then(result => {
            dispatch(success());
            history.push("/" + blog_link);
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

          for (var i = 0; i < data.blogs.length; i++) {
            let blog_ref = db.collection("blogs").doc(data.blogs[i]);

            let blog_link = data.blogs[i];
            promises.push(
              blog_ref.get().then(doc => {
                my_blogs.push({
                  blog_link: blog_link,
                  blog_title: doc.data().blog_title
                });
              })
            );
          }

          Promise.all(promises).then(() => {
            dispatch(success(my_blogs));
          });
        } else {
          console.log("This user could not be found.");
        }
      })
      .catch(error => {
        console.log(error);
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
