import * as types from "./actionTypes";
import "firebase/database";
import "firebase/auth";
import firebase from "../server/firebase";

export const blogActions = { new_blog, get_blogs };

let db = firebase.database();
let auth = firebase.auth();
function new_blog(blog_link, blog_title) {
  return dispatch => {
    dispatch(request());
    var newBlogRef = db
      .ref("/")
      .child("blogs")
      .push();
    var userid = auth.currentUser.uid;

    newBlogRef
      .set({
        blog_link: blog_link,
        blog_title: blog_title,
        creator: userid
      })
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

    var ref = db.ref("blogs/");
    var userid = auth.currentUser.uid;

    ref.on(
      "value",
      function(snapshot) {
        let blogs = snapshot.val();
        let my_blogs = []

        for (var blog in blogs) {
          if (blogs[blog].creator === userid) {
              blogs[blog].id = blog
              my_blogs.push(blogs[blog])
          }
        }

        console.log(my_blogs)
        dispatch(success(my_blogs))
      },
      function(error) {
        dispatch(failure(error));
        console.log(error);
      }
    );
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
