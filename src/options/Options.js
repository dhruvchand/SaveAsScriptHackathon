import React from "react";
import "./Options.css";
import { CSVLink } from "react-csv";
import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
  getContextSwitches,
} from "../common/storage.js";

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
      <div className="App">
        <header className="App-header">
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
          <table>
            {this.state.stack.map((k) =>
              k.urls.map((url) => (
                <tr key={url}>
                  <td> {url.url} </td>
                  <td> {url.ps} </td>
                  <td>tabName :{k.tabName}</td>
                  <td>tabUrl :{k.tabUrl}</td>
                </tr>
              ))
            )}
          </table>
        </header>
      </div>
    );
  }
}

export default Options;
