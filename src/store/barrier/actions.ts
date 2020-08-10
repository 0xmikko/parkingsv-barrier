/*
 * Buzzzchat - P2P Chat based on Bluzelle DB
 * Copyright (c) 2020. Mikhail Lazarev
 */

import {ThunkAction} from 'redux-thunk';
import {RootState} from '../index';
import {Action} from 'redux';
import {SocketEmitAction} from "../socketMiddleware";

export const connectSocket = (): ThunkAction<
  void,
  RootState,
  unknown,
  Action<string>
> => async (dispatch) => {
  dispatch({
    type: 'SOCKET_ON',
    namespace: 'barrier',
    event: 'barrier:open',
    typeOnSuccess: 'BARRIER_OPEN',
  });
};

export const connect: (opHash: string) => SocketEmitAction = (opHash) => ({
  type: 'SOCKET_EMIT',
  namespace: 'barrier',
  event: 'profile:list',
  typeOnFailure: 'CONNECTED_FAILED',
  payload: undefined,
  opHash,
});
