import "./App.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import { PrimaryButton, DefaultPalette } from "@fluentui/react";
import { FontSizes } from "@fluentui/theme";
import { IconButton } from "@fluentui/react/lib/Button";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Separator } from "@fluentui/react/lib/Separator";

import {
  Stack,
  IStackStyles,
  IStackTokens,
  IStackItemStyles,
} from "@fluentui/react/lib/Stack";

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

initializeIcons();

const settingsIcon = {
  iconName: "Settings",
  styles: {
    root: {
      color: "white",
    },
  },
};

// Non-mutating styles definition
const stackItemStyles = {
  root: {
    alignItems: "center",
    background: DefaultPalette.themeDarker,
    color: DefaultPalette.white,
    display: "flex",
    height: 40,
    justifyContent: "center",
    overflow: "hidden",
  },
};
const nonShrinkingStackItemStyles = {
  root: {
    alignItems: "center",
    background: DefaultPalette.themeDarker,
    color: DefaultPalette.white,
    height: 40,
    display: "flex",
    justifyContent: "start",
    overflow: "hidden",
    paddingLeft: "10px",
  },
};
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
    if (urls.length > 0) {
      for (let i = 0; i < urls.length; i++) {
        recentCode = urls[0].ps;
        if (recentCode != "") {
          recentGraphUri = urls[i].url;
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
        <Stack horizontal>
          <Stack.Item
            grow={5}
            styles={nonShrinkingStackItemStyles}
            disableShrink
          >
            <div
              style={{ fontSize: FontSizes.size16, fontWeight: FontSizes.bold }}
            >
              Microsoft Graph X-Ray
            </div>
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyles}>
            <IconButton
              onClick={this.openOptionsPage}
              iconProps={settingsIcon}
              title="Settings"
              ariaLabel="Settings"
            />
          </Stack.Item>
        </Stack>
        <div>
          <Separator alignContent="start">
            <b>Commands used recently</b>
          </Separator>
          {this.state.recentGraphUri}
          <pre>
            <code>{this.state.recentCode}</code>
          </pre>
          <PrimaryButton onClick={this.clearData}>Clear Data</PrimaryButton>
          <PrimaryButton onClick={this.openOptionsPage}>
            View All Commands
          </PrimaryButton>
          <Separator alignContent="start">
            <b>Graph APIs commonly used in this blade</b>
          </Separator>
          <ReactMarkdown children={this.state.doc} />
        </div>
      </div>
    );
  }
}

export default App;
