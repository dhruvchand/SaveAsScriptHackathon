import "./App.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import { PrimaryButton, DefaultPalette, getTheme } from "@fluentui/react";
import { FontSizes } from "@fluentui/theme";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Stack } from "@fluentui/react/lib/Stack";
import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
} from "./common/storage.js";

import urlDocMap from "./doc/map.json";
import { getActiveTab } from "./common/tabs";
import { findMatchingUrlTemplate } from "./common/helpers";
import { CommandMenu } from "./components/popup/CommandMenu.js";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

const theme = getTheme();
initializeIcons();

// Non-mutating styles definition
const stackItemStyles = {
  root: {
    alignItems: "center",
    background: DefaultPalette.themeDarker,
    color: DefaultPalette.white,
    display: "flex",
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
};
const nonShrinkingStackItemStyles = {
  root: {
    alignItems: "center",
    background: DefaultPalette.themeDarker,
    color: DefaultPalette.white,
    height: 50,
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
        if (recentCode !== "") {
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
    this.setState({ isActive: !this.state.isActive });

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

  render() {
    return (
      <div className="App" style={{ fontSize: FontSizes.size12 }}>
        <Stack horizontal>
          <Stack.Item grow styles={stackItemStyles}>
            <img alt="logo" src="./img/icon-16.svg" height="22px"></img>
          </Stack.Item>
          <Stack.Item
            grow={10}
            styles={nonShrinkingStackItemStyles}
            disableShrink
          >
            <div
              style={{
                fontSize: FontSizes.size16,
                fontWeight: 600,
              }}
            >
              Microsoft Graph X-Ray
            </div>
          </Stack.Item>
          <Stack.Item grow styles={stackItemStyles}>
            <CommandMenu></CommandMenu>
          </Stack.Item>
        </Stack>
        <div className="App-body">
          <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>Graph API commonly used in this blade</h2>
            <ReactMarkdown children={this.state.doc} />
          </div>
          <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>Graph call history</h2>
            <PrimaryButton onClick={this.openOptionsPage}>
              View Graph calls in realtime
            </PrimaryButton>
            <SyntaxHighlighter
              language="jboss-cli"
              style={atomOneDark}
              wrapLongLines={true}
            >
              {this.state.recentGraphUri}
            </SyntaxHighlighter>
            <SyntaxHighlighter
              language="powershell"
              style={atomOneDark}
              wrapLongLines={true}
            >
              {this.state.recentCode}
            </SyntaxHighlighter>
          </div>
          <div style={{ padding: "10px" }}>
            <PrimaryButton onClick={this.clearData}>Clear Data</PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
