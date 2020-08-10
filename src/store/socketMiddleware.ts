import io from "socket.io-client";
import { RootState } from "./index";
import { ThunkDispatch, ThunkMiddleware } from "redux-thunk";
import { Action, MiddlewareAPI, Dispatch } from "redux";
import { BACKEND_ADDR, CODE } from "../config";
import { actionsAfterAuth } from "./actions";

export interface SocketEmitAction {
  type: "SOCKET_EMIT";
  event: string;
  payload: unknown;
  typeOnFailure: string;
  opHash?: string;
}

export interface SocketOnAction {
  type: "SOCKET_ON";
  event: string;
  typeOnSuccess: string;
}

export interface SocketOffAction {
  type: "SOCKET_OFF";
}

type resolver = (value?: SocketIOClient.Socket | undefined) => void;

export function createSocketMiddleware(): ThunkMiddleware<
  RootState,
  Action<string>,
  Action<string>
> {
  let socketAuth: SocketIOClient.Socket | undefined = undefined;
  let isConnecting: boolean = false;
  let waitingPromises: resolver[] = [];

  /*
   * getNamespace returns promise for connected and authentificated namespace
   */
  const getNamespace: (dispatch: Dispatch) => Promise<SocketIOClient.Socket> = (
    dispatch
  ) => {
    return new Promise<SocketIOClient.Socket>((resolve, reject) => {
      if (socketAuth !== undefined) {
        resolve(socketAuth);
        return;
      }

      // If connection in progress we add resolver in queue
      if (isConnecting) {
        waitingPromises.push(resolve);
        return;
      } else {
        isConnecting = true;
        waitingPromises = [];
      }

      console.log(`CONNECTING!!!! TO ${BACKEND_ADDR}`);
      let socket = io(BACKEND_ADDR + "/", {
        reconnection: true,
        reconnectionDelay: 500,
        jsonp: false,
        reconnectionAttempts: Infinity,
        transports: ["websocket"],
      });

      socket.on("connect_error", (err: string) => {
        console.log(err);
      });

      socket
        .emit("auth", CODE) //send the jwt
        .on("authenticated", () => {
          socketAuth = socket;
          isConnecting = false;
          console.log("CONNECTED", socketAuth);
          // @ts-ignore
          dispatch(actionsAfterAuth());
          resolve(socket);

          for (const f of waitingPromises) {
            f(socket);
          }
        })

        .on("disconnect", () => {
          console.log("DISCONNECTED!");
          if (socketAuth) socketAuth = undefined;
        });
    });
  };

  /*
   ** Middleware gets connection and emits new request or start to listen on
   */

  return ({ dispatch, getState }) => {
    return (next: Dispatch) => (
      action: SocketEmitAction | SocketOnAction | SocketOffAction
    ) => {
      console.log("DISPATCH", action);
      switch (action.type) {
        case "SOCKET_EMIT":
          getNamespace(dispatch).then((socket) => {
            socket.emit(action.event, action.payload, action.opHash);
            console.log(
              `[SOCKET.IO] : EMIT : ${action.event} with opHash ${action.opHash}`
            );
          });

          return next(action);

        case "SOCKET_ON":
          getNamespace(dispatch).then((socket) => {
            if (socket.hasListeners(action.event)) return;
            socket.on(action.event, (payload: any) => {
              console.log("[SOCKET.IО] : GET NEW INFO : ", payload);
              dispatch({
                type: action.typeOnSuccess,
                payload: payload,
              });
            });
            console.log("[SOCKET.IO] : LISTENER ADDED : ", action.event);
          });
          return next(action);

        case "SOCKET_OFF":
          socketAuth = undefined;
          isConnecting = false;
          waitingPromises = [];
          return next(action);

        default:
          console.log("NEXT", action);
          return next(action);
      }
    };
  };
}

export default createSocketMiddleware();
