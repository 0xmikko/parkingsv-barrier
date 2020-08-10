/*
 * Buzzzchat - P2P Chat based on Bluzelle DB
 * Copyright (c) 2020. Mikhail Lazarev
 */

import * as barrier from "./barrier/actions";
import * as operations from "redux-data-connect/lib/operations/actions";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./index";
import { Action } from "redux";

export default {
  barrier,
  operations,
};

// Connect socket connects redux with socket server interface
export const actionsAfterAuth = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch) => {
  // Connect sockets to listen server events
  dispatch(barrier.connectSocket());
  dispatch(operations.connectSocket());

  console.log("[SOCKET.IO]: All listeners connected!");
};
