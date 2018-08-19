import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default (state = initialState, action) => {
  switch (action.type) {
    case types.NEW_POST_REQUEST:
      return state;

    case types.NEW_POST_SUCCESS:
      return state;

    case types.NEW_POST_FAILURE:
      return state;

    case types.GET_POSTS_REQUEST:
      return state;

    case types.GET_POSTS_SUCCESS:
      return state.merge({
        posts: action.posts
      });

    case types.GET_POSTS_FAILURE:
      return state;

      case types.GET_POST_REQUEST:
      return state;

    case types.GET_POST_SUCCESS:
      return state.merge({
        post: action.post
      });

    case types.GET_POST_FAILURE:
      return state;

    default:
      return state;
  }
};
