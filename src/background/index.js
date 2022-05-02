import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
  getContextSwitches,
  commitIfActive,
} from "../common/storage.js";

import { getActiveTab, getStartTab } from "../common/tabs.js";

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export async function init() {
  // // initialize storage
  // chrome.runtime.onInstalled.addListener(async function (details) {
  //   await saveObjectInLocalStorage({
  //     currentMetrics: {
  //       urls: [],
  //     },
  //     contextSwitches: 0,
  //     stack: [],
  //     isActive: false,
  //   });
  // });
  // // Doesn't work well with MV3, revisit later.
  // chrome.webRequest.onBeforeRequest.addListener(
  //   async function (details) {
  //     console.log("onBeforeRequest", details);
  //     //If this is a graph request update badge count of extension to show there is an api
  //     let tabId = getActiveTab().tabId;
  //     chrome.action.getBadgeText({ tabId: tabId }, function (result) {
  //       console.log("tab", result);
  //       let count = result === null || isNaN(result) ? 0 : Number(result) + 1;
  //       chrome.action.setBadgeText({
  //         tabId: tabId,
  //         text: count.toString(),
  //       });
  //     });
  //   },
  //   { urls: ["https://graph.microsoft.com/*"] },
  //   ["requestBody"]
  // );
  // // Doesn't work well with MV3, revisit later.
  // //record context switch when the current tab title changes
  // chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  //   console.log("tabsOnUpdated", changeInfo);
  //   const isLoading = changeInfo.status && changeInfo.status === "loading";
  //   if ((changeInfo.title || changeInfo.url) && !isLoading) {
  //     chrome.action.setBadgeText({
  //       tabId: tabId,
  //       text: "",
  //     });
  //   }
  // });
  // // record context switch on tab switch
  // chrome.tabs.onActivated.addListener(async function (activeInfo) {
  //   console.log("onActivated", activeInfo);
  // });
  // chrome.runtime.onMessage.addListener(async function (
  //   request,
  //   sender,
  //   sendResponse
  // ) {
  //   if (request.method === "start") {
  //   }
  //   if (request.method === "stop") {
  //   }
  //   if (request.method === "clear") {
  //     await saveObjectInLocalStorage({
  //       currentMetrics: {
  //         urls: [],
  //       },
  //       stack: [],
  //       contextSwitches: 0,
  //       isActive: false,
  //     });
  //   }
  // });
}

// init();
