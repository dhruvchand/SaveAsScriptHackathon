import "./App.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
  getContextSwitches,
} from "./common/storage.js";

import urlDocMap from "./doc/map.json";
import { getActiveTab } from "./common/tabs";
import { findMatchingUrlTemplate } from "./common/helpers";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "",
      isActive: false,
      stack: [],
      doc: "",
      recentCode: "",
      recentGraphUri: "",
    };
  }

  componentDidMount() {
    // Add listener when component mounts
    this.timerID = setInterval(() => this.getMetrics(), 500);
    this.fetchRelevantDocs();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getMetrics = async () => {
    let currentMetrics = await getCurrentMetrics();
    let { urls, tabName } = currentMetrics;
    let isActive = await getIsActive();
    let stack = await getStack();

    //Get the most recent PowerShell command
    let recentGraphUri = "";
    let recentCode = "";
    chrome.browserAction.setBadgeText({
      tabId: getActiveTab().tabId,
      text: null,
    });
    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        recentCode = urls[0].ps;
        if (recentCode != "") {
          recentGraphUri = urls[i].url;
          chrome.browserAction.setBadgeText({
            tabId: getActiveTab().tabId,
            text: "1",
          });
          break;
        }
      }
    }

    this.setState({
      message: {
        urls,
        tabName,
      },
      stack: stack,
      isActive: isActive,
      recentCode: recentCode,
      recentGraphUri: recentGraphUri,
    });
  };

  clearData = () => {
    chrome.runtime.sendMessage(
      {
        method: "clear",
      },
      function (response) {
        console.log("data cleared");
      }
    );
  };

  toggleStart = () => {
    this.state.isActive = !this.state.isActive;

    if (this.state.isActive) {
      chrome.runtime.sendMessage(
        {
          method: "start",
        },
        function (response) {
          console.log(response.farewell);
        }
      );

      saveObjectInLocalStorage({
        isActive: this.state.isActive,
        contextSwitches: 0,
      });
    } else {
      chrome.runtime.sendMessage(
        {
          method: "stop",
        },
        function (response) {}
      );
      saveObjectInLocalStorage({
        isActive: this.state.isActive,
      });
    }
  };

  fetchRelevantDocs = async () => {
    const [tab] = await getActiveTab();
    const url = tab.url;
    const template = findMatchingUrlTemplate(
      url,
      urlDocMap.map((entry) => entry.PortalUri)
    );

    if (!template) {
      this.setState({ doc: "No relevant documentation found for this page." });
      return;
    }

    const result = urlDocMap.find(
      (entry) => entry.PortalUri === template.template
    );

    var useLocalDoc = true;
    var docRoot =
      "https://raw.githubusercontent.com/dhruvchand/SaveAsScriptHackathon/main/src/public/doc/";
    if (useLocalDoc) {
      docRoot = "./doc/";
    }
    const docPath = docRoot + result.Markdown;

    await fetch(docPath)
      .then((response) => response.text())
      .then((text) => {
        this.setState({ doc: text });
      });
  };

  openOptionsPage = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL("options.html"));
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Graph XRay
          <button onClick={this.toggleStart}>
            {this.state.isActive ? "Stop Recording" : "Start Recording"}
          </button>
          <button onClick={this.clearData}>Clear Data</button>
          <button onClick={this.openOptionsPage}>View More</button>
        </header>
        <div className="Markdown-body">
          <h3>Commands used recently</h3>
          {this.state.recentGraphUri}
          <pre>
            <code>{this.state.recentCode}</code>
          </pre>
          <hr></hr>
          <h3>Graph APIs commonly used in this blade</h3>
          <ReactMarkdown children={this.state.doc} />
        </div>
      </div>
    );
  }
}

export default App;
