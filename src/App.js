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

import ApplicationOwnersDoc from "./doc/application-owners.md";
import ApplicationsDoc from "./doc/applications.md";
import GroupMembersDoc from "./doc/group-members.md";
import GroupMembershipsDoc from "./doc/group-memberships.md";
import GroupOwnersDoc from "./doc/group-owners.md";
import GroupsDoc from "./doc/groups.md";
import ServicePrincipalOwnersDoc from "./doc/service-principal-owners.md";
import ServicePrincipalsDoc from "./doc/service-principals.md";
import UserDetailsDoc from "./doc/user-details.md";
import UsersDoc from "./doc/users.md";

const docPaths = {
  "application-owners.md": ApplicationOwnersDoc,
  "applications.md": ApplicationsDoc,
  "group-members.md": GroupMembersDoc,
  "group-memberships.md": GroupMembershipsDoc,
  "group-owners.md": GroupOwnersDoc,
  "groups.md": GroupsDoc,
  "service-principal-owners.md": ServicePrincipalOwnersDoc,
  "service-principals.md": ServicePrincipalsDoc,
  "user-details.md": UserDetailsDoc,
  "users.md": UsersDoc,
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "",
      isActive: false,
      stack: [],
      doc: "",
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
    const docPath = docPaths[result.Markdown];

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
          <button onClick={this.toggleStart}>
            {this.state.isActive ? "Stop Recording" : "Start Recording"}
          </button>
          <button onClick={this.clearData}>Clear Data</button>
          <button onClick={this.openOptionsPage}>View More</button>
          <table>
            <tbody>
              {Object.entries(this.state.message).map((k) => (
                <tr key={k}>{`${k[0]}: ${k[1]}`}</tr>
              ))}
            </tbody>
          </table>
        </header>
        <ReactMarkdown children={this.state.doc} />
      </div>
    );
  }
}

export default App;
