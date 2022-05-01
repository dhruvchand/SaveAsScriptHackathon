import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
  getContextSwitches,
  commitIfActive,
} from "../common/storage.js";

import { getActiveTab, getStartTab } from "../common/tabs.js";

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
      chrome.action.getBadgeText({ tabId: tabId }, function (result) {
        console.log("tab", result);
        let count = result === null || isNaN(result) ? 0 : Number(result) + 1;
        chrome.action.setBadgeText({
          tabId: tabId,
          text: count.toString(),
        });
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
    const isLoading = changeInfo.status && changeInfo.status === "loading";
    if ((changeInfo.title || changeInfo.url) && !isLoading) {
      const [tab] = await getActiveTab();
      const currentMetrics = await getCurrentMetrics();
      let stack = await getStack();
      let contextSwitches = await getContextSwitches();
      const isActive = await getIsActive();

      chrome.action.setBadgeText({
        tabId: tab.tabId,
        text: "",
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
