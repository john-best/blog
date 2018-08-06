import * as types from "./actionTypes";

export const authActions = { login };

function login(email, password) {
    return dispatch => {
        dispatch(request());
        console.log("TODO: handle login request");

        // firebase stuff here
    }

    function request() {
        return { type: types.LOGIN_REQUEST }
    }

    function success() {
        return { type: types.LOGIN_SUCCESS }
    }

    function failure(error) {
        return { type: types.LOGIN_FAILURE, error: error }
    }
}