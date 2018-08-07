import { combineReducers } from "redux";
import authReducer from "./authReducer";
import blogReducer from "./blogReducer";
import postReducer from "./postReducer";

export const rootReducer = combineReducers({
    authReducer,
    blogReducer,
    postReducer,
})