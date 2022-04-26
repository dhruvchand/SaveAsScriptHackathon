import "./App.css";
import React from "react";
import {
  saveObjectInLocalStorage,
  getIsActive,
  getCurrentMetrics,
  getStack,
  getContextSwitches,
} from "./common/storage.js";

class App extends React.Component {
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
    this.timerID = setInterval(() => this.getMetrics(), 500);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getMetrics = async () => {
    let currentMetrics = await getCurrentMetrics();
    let { urls, tabName } = currentMetrics;
    let isActive = await getIsActive();
    let stack = await getStack();

    this.setState({
      message: {
        urls,
        tabName,
      },
      stack: stack,
      isActive: isActive,
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.toggleStart}>
            {this.state.isActive ? "Stop Recording" : "Start Recording"}
          </button>
          <button onClick={this.clearData}>Clear Data</button>
          <table>
            {Object.entries(this.state.message).map((k) => (
              <tr key={k}>{`${k[0]}: ${k[1]}`}</tr>
            ))}
          </table>
        </header>
      </div>
    );
  }
}

export default App;
