/*
 * Buzzzchat - P2P Chat based on Bluzelle DB
 * Copyright (c) 2020. Mikhail Lazarev
 */
import { RootState } from "../index";

export const CONTACT_PREFIX = "CONTACTS@@";
export const endpoint = "/api/contacts/";
export const barrierSelector = (state: RootState) => state.barrier;

export type BarrierAction = {
  type: "BARRIER_OPEN";
};
