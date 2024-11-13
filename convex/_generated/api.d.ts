/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as autoPlayingBot from "../autoPlayingBot.js";
import type * as gameLogic from "../gameLogic.js";
import type * as gameStates from "../gameStates.js";
import type * as internalFunctions from "../internalFunctions.js";
import type * as rooms from "../rooms.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  autoPlayingBot: typeof autoPlayingBot;
  gameLogic: typeof gameLogic;
  gameStates: typeof gameStates;
  internalFunctions: typeof internalFunctions;
  rooms: typeof rooms;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
