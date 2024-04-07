import { combineReducers } from "redux";
import { userReducer } from "./userReducer";

export const combineReducer = combineReducers({
    userReducer:userReducer,    // Assign userReducer to the 'userReducer' key in the state
});