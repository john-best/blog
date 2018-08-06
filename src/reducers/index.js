import * as types from "../actions/actionTypes";
import Immutable from "seamless-immutable";

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_REQUEST:
      return state.merge({ logging_in: true });

    case types.LOGIN_SUCCESS:
      return state.merge({ logging_in: false, logged_in: true });

    case types.LOGIN_FAILURE:
      return state.merge({ logging_in: false, error: action.error });

    case types.REGISTER_REQUEST:
      return state.merge({ registering: true });

    case types.REGISTER_SUCCESS:
      return state.merge({ registering: false, logged_in: true });

    case types.REGISTER_FAILURE:
      return state.merge({ registering: false, error: action.error });

    default:
      return state;
  }
};

const initialState = Immutable({});
