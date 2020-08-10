import { combineReducers } from "redux";
import barrier from "./barrier/reducer";
import { operationReducer } from "redux-data-connect";

export default combineReducers({
  barrier,
  operations: operationReducer,
});
