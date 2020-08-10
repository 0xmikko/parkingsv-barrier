/*
 * ParkingSV - Interplanetary Parking System
 * Copyright (c) 2020. Mikhail Lazarev
 */

import {Barrier} from "../../core/barrier";
import {BarrierAction} from "./";

export interface BarrierState extends Barrier {}

const initialState: BarrierState = {
  open: false,
};

export default function createReducer(
  state: BarrierState = initialState,
  action: BarrierAction
): BarrierState {
  switch (action.type) {
    case "BARRIER_OPEN":
      return {
        open: true,
      };
  }

  return state;
}
