import React from "react";
import "./Options.css";
import { CSVLink } from "react-csv";
import { CodeView } from "../components/CodeView";
import { AppHeader } from "../components/AppHeader";
import { FontSizes } from "@fluentui/theme";
import { PrimaryButton, DefaultPalette, getTheme } from "@fluentui/react";
import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
  getContextSwitches,
} from "../common/storage.js";

const theme = getTheme();
class Options extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "",
      isActive: false,
      stack: [],
    };
  }

  componentDidMount() {
    // Add listener when component mounts
    this.timerID = setInterval(() => this.getMetrics(), 250);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getMetrics = async () => {
    let currentMetrics = await getCurrentMetrics();
    let { concepts, choices, clicks, keystrokes, tabName, tabUrl } =
      currentMetrics;
    let isActive = await getIsActive();
    let stack = await getStack();
    let contextSwitches = await getContextSwitches();

    this.setState({
      message: {
        concepts,
        choices,
        clicks,
        keystrokes,
        contextSwitches,
        tabName,
        tabUrl,
      },
      stack: [currentMetrics, ...stack],
      isActive: isActive,
    });
  };

  toggleStart = () => {
    this.setState({
      isActive: !this.state.isActive,
    });

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

  render() {
    return (
      <div className="App" style={{ fontSize: FontSizes.size12 }}>
        <AppHeader hideSettings={true}></AppHeader>
        <header className="App-header">
        <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>Graph Call Stack Trace</h2>
            <p>
              Drag this tab out and place it side-by-side to your Azure Portal window to see a realtime view of graph calls being made as you use the portal.
            </p>
            <p>
              Not all Azure Portal blades use the published Graph APIs, this means the stack trace will only be displayed on supported blades (E.g. Users, Applications, etc.).
            </p>
          </div>

          <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            {this.state.stack.map((k) =>
              k.urls.map((url) => (
                <div             style={{
                  boxShadow: theme.effects.elevation16,
                  padding: "10px",
                  marginBottom: "15px",
                }}>
                <CodeView httpRequest={url.url} code={url.ps} lightUrl={true} ></CodeView>
                </div>
              ))
            )}
            </div>
        </header>
        <button onClick={this.toggleStart}>
            {this.state.isActive ? "Stop Recording" : "Start Recording"}
          </button>
          <br />
          <br />
          <button>
            <CSVLink data={this.state.stack}>Download data</CSVLink>
          </button>
          <br />
          <br />
      </div>
    );
  }
}

export default Options;
