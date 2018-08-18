import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState, action) => {
  switch (action.type) {
    case types.NEW_BLOG_REQUEST:
      return state;

    case types.NEW_BLOG_SUCCESS:
      return state;

    case types.NEW_BLOG_FAILURE:
      return state;

    case types.GET_BLOGS_REQUEST:
      return state;

    case types.GET_BLOGS_SUCCESS:
      return state.merge({
          blogs: action.blogs,
          blog_get_success: true
      })

    case types.GET_BLOGS_FAILURE:
      return state.merge({
        blog_get_success: false,
        error: action.error
      });

    default:
      return state;
  }
};
