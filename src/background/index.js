import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
  getContextSwitches,
  commitIfActive,
} from "../common/storage.js";

import { getActiveTab, getStartTab } from "../common/tabs.js";

import { getPowershellCmd } from "../common/client.js";
init();

// This needs to be an export due to typescript implementation limitation of needing '--isolatedModules' tsconfig
export async function init() {
  let startTime;

  // initialize storage
  chrome.runtime.onInstalled.addListener(async function (details) {
    await saveObjectInLocalStorage({
      currentMetrics: {
        urls: [],
      },
      contextSwitches: 0,
      stack: [],
      isActive: false,
    });
  });

  chrome.webRequest.onBeforeRequest.addListener(
    async function (details) {
      console.log("onBeforeRequest", details);

      let tabId = getActiveTab().tabId;
      chrome.browserAction.getBadgeText({ tabId: tabId }, function (result) {
        console.log("tab", result);
        let count = result === null || isNaN(result) ? 0 : Number(result) + 1;
        chrome.browserAction.setBadgeText({
          tabId: tabId,
          text: count.toString(),
        });
      });

      let requestBody;
      if (details.requestBody) {
        requestBody = decodeURIComponent(
          String.fromCharCode.apply(
            null,
            new Uint8Array(details.requestBody.raw[0].bytes)
          )
        );
      }
      console.log("requestBody", requestBody);

      const powershellCmd = await getPowershellCmd(details.method, details.url);

      console.log(powershellCmd);
      const request = details.method + " " + details.url;

      const currentMetrics = await getCurrentMetrics();
      currentMetrics.urls.unshift({
        url: request,
        ps: powershellCmd,
        requestBody: requestBody,
      });
      commitIfActive({
        currentMetrics: {
          ...currentMetrics,
        },
      });
    },
    { urls: ["https://graph.microsoft.com/*"] },
    ["requestBody"]
  );

  console.log("Init complete.");

  // record context switch on tab switch
  chrome.tabs.onActivated.addListener(async function (activeInfo) {
    const [tab] = await getActiveTab();
    if (tab.url.includes("http")) {
      const currentMetrics = await getCurrentMetrics();
      let stack = await getStack();
      let contextSwitches = await getContextSwitches();
      const isActive = await getIsActive();
      const timeElapsed = performance.now() - startTime;

      if (isActive) {
        const currentMetricsSnapshot = {
          time: `${Math.round((performance.now() - startTime) / 1000)} s`,
          ...currentMetrics,
        };

        stack.unshift(currentMetricsSnapshot);

        startTime = performance.now();
        await saveObjectInLocalStorage({
          currentMetrics: {
            urls: [],
            tabName: tab.title,
            tabUrl: tab.url,
          },
          stack: stack,
          contextSwitches: contextSwitches + 1,
        });
      }
    }
  });

  //record context switch when the current tab title changes
  chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo) {
    console.log(changeInfo);
    const isLoading = changeInfo.status && changeInfo.status == "loading";
    if ((changeInfo.title || changeInfo.url) && !isLoading) {
      const [tab] = await getActiveTab();
      const currentMetrics = await getCurrentMetrics();
      let stack = await getStack();
      let contextSwitches = await getContextSwitches();
      const isActive = await getIsActive();

      chrome.browserAction.setBadgeText({
        tabId: tab.tabId,
        text: null,
      });

      if (isActive) {
        const currentMetricsSnapshot = {
          time: `${Math.round((performance.now() - startTime) / 1000)} s`,
          ...currentMetrics,
        };

        stack.unshift(currentMetricsSnapshot);

        startTime = performance.now();
        await saveObjectInLocalStorage({
          currentMetrics: {
            urls: [],
            tabName: tab.title,
            tabUrl: tab.url,
          },
          stack: stack,
          contextSwitches: contextSwitches + 1,
        });
      }
    }
  });

  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    if (request.method === "start") {
      const [tab] = await getStartTab();
      const currentMetrics = await getCurrentMetrics();

      startTime = performance.now();
      await saveObjectInLocalStorage({
        currentMetrics: {
          ...currentMetrics,
          tabName: tab.title,
          tabUrl: tab.url,
        },
      });
    }
    if (request.method === "stop") {
      const currentMetrics = await getCurrentMetrics();

      await saveObjectInLocalStorage({
        currentMetrics: {
          time: `${Math.round((performance.now() - startTime) / 1000)} s`,
          ...currentMetrics,
        },
      });
    }

    if (request.method === "clear") {
      await saveObjectInLocalStorage({
        currentMetrics: {
          urls: [],
        },
        stack: [],
        contextSwitches: 0,
        isActive: false,
      });
    }
  });
}
