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
import type * as actions_genCouponCodeAndSaveToDB from "../actions/genCouponCodeAndSaveToDB.js";
import type * as actions_validatePhoneNumber from "../actions/validatePhoneNumber.js";
import type * as functions_couponCode from "../functions/couponCode.js";
import type * as functions_imageUpload from "../functions/imageUpload.js";
import type * as functions_responses from "../functions/responses.js";
import type * as functions_resturants from "../functions/resturants.js";
import type * as functions_settings from "../functions/settings.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/genCouponCodeAndSaveToDB": typeof actions_genCouponCodeAndSaveToDB;
  "actions/validatePhoneNumber": typeof actions_validatePhoneNumber;
  "functions/couponCode": typeof functions_couponCode;
  "functions/imageUpload": typeof functions_imageUpload;
  "functions/responses": typeof functions_responses;
  "functions/resturants": typeof functions_resturants;
  "functions/settings": typeof functions_settings;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
