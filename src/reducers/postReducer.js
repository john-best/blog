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

    default:
      return state;
  }
};
