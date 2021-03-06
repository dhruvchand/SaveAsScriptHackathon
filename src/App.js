import "./App.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { PrimaryButton, DefaultPalette, getTheme } from "@fluentui/react";
import { FontSizes } from "@fluentui/theme";
import { AppHeader } from "./components/AppHeader";
import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
} from "./common/storage.js";
import urlDocMap from "./doc/map.json";
import { getActiveTab } from "./common/tabs";
import { findMatchingUrlTemplate } from "./common/helpers";
import { openOptionsPage } from "./components/CommandMenu.js";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

const theme = getTheme();
initializeIcons();

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
    // Add listener when component mounts
    this.addListener();
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

  addListener() {
    if (!window.chrome.webview) {
      return;
    }
    window.chrome.webview.addEventListener("message", (event) => {
      console.log("Got message from host!");
      console.log(event.data);
      const msg = JSON.parse(event.data);
      if (msg.eventName === "PreviewMarkdown") {
        console.log("Showing markdown.");
        this.showMarkdown(msg.markdown);
      }
    });
  }

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
        this.showMarkdown(text);
      });
  };

  showMarkdown = async (markdownContent) => {
    if (markdownContent.startsWith("---")) {
      //Remove metadata
      console.log("Removing metadata");
      markdownContent = markdownContent.split("---")[2];
    }
    this.setState({ doc: markdownContent });
  };

  render() {
    return (
      <div className="App" style={{ fontSize: FontSizes.size12 }}>
        <AppHeader></AppHeader>
        <div className="App-body">
          <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>Graph API commonly used in this blade</h2>
            <ReactMarkdown
              linkTarget={"_blank"}
              children={this.state.doc}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")}
                      style={atomOneDark}
                      language={match[1]}
                      PreTag="div"
                      wrapLongLines={true}
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
          <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>Graph call history</h2>
            <p>
              To view Graph calls in real-time open Developer Tools and switch
              to the Graph X-Ray panel.
            </p>
            <PrimaryButton
              onClick={openOptionsPage}
              iconProps={{ iconName: "OpenInNewTab" }}
            >
              Show me how
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
