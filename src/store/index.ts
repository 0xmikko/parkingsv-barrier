/*
 * Buzzzchat - P2P Chat based on Bluzelle DB
 * Copyright (c) 2020. Mikhail Lazarev
 */

import { applyMiddleware, compose, createStore } from "redux";
import reducer from "./reducer";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { createApiMiddleware, getFullUrl } from "redux-data-connect";
import createSocketMiddleware from "./socketMiddleware";
import { BACKEND_ADDR } from "../config";

export type RootState = ReturnType<typeof reducer>;

let composeEnhancers: typeof compose;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  composeEnhancers = composeWithDevTools({});
} else {
  composeEnhancers = compose;
}

const apiMiddleware = createApiMiddleware(
  getFullUrl("/auth/token/refresh/", { host: BACKEND_ADDR })
);

export default function configureStore() {
  return createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(thunk, createSocketMiddleware, apiMiddleware)
    )
  );
}
