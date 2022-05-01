import React from "react";
import "./DevTools.css";
import { CodeView } from "../components/CodeView";
import { AppHeader } from "../components/AppHeader";
import { FontSizes } from "@fluentui/theme";
import { PrimaryButton, DefaultPalette, getTheme } from "@fluentui/react";
import { getRequestBody, getCodeView } from "../common/client.js";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import { DevToolsCommandBar } from "../components/DevToolsCommandBar";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

const theme = getTheme();
initializeIcons();

const dropdownStyles = {
  dropdown: { width: 300 },
};

const options = [
  { key: "powershell", text: "PowerShell" },
  { key: "c#", text: "C#" },
  { key: "javascript", text: "JavaScript" },
  { key: "java", text: "Java" },
  { key: "objective-c", text: "Objective-C" },
  { key: "go", text: "Go" },
];

class DevTools extends React.Component {
  constructor() {
    super();
    this.state = {
      stack: [],
      snippetLanguage: "powershell",
    };
  }

  componentDidMount() {
    // Add listener when component mounts
    this.addListener();
  }

  clearStack() {
    this.setState({ stack: [] });
  }

  async addRequestToStack(request) {
    const codeView = await getCodeView(this.state.snippetLanguage, request);
    if (codeView) {
      this.setState({ stack: [...this.state.stack, codeView] });
    }
  }

  async getBatchRequests(request, requestBody) {
    const version = request.url.split("/$batch")[0];
    let requests = JSON.parse(requestBody)?.requests;
    let calls = await Promise.all(
      requests.map(async (request) => {
        await this.addRequestToStack(request);
      })
    );
  }

  addListener() {
    chrome.devtools.network.onRequestFinished.addListener(async (request) => {
      try {
        if (
          request.request &&
          request.request.url &&
          request.request.url.includes("https://graph.microsoft.com")
        ) {
          request = request.request;

          try {
            let requestBody = getRequestBody(request);

            if (request.url.includes("/$batch") && requestBody) {
              await this.getBatchRequests(request, requestBody);
            } else {
              await this.addRequestToStack(request);
            }
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  onLanguageChange = (e, option) => {
    this.setState({ snippetLanguage: option.key });
    this.clearStack();
  };
  render() {
    return (
      <div className="App" style={{ fontSize: FontSizes.size12 }}>
        <AppHeader hideSettings={true}></AppHeader>
        <DevToolsCommandBar></DevToolsCommandBar>
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
              Not all Azure Portal blades use the published Graph APIs, this
              means the stack trace will only be displayed on supported blades
              (E.g. Users, Applications, etc.).
            </p>
            <Dropdown
              placeholder="Select an option"
              label="Select language"
              options={options}
              styles={dropdownStyles}
              defaultSelectedKey={this.state.snippetLanguage}
              onChange={this.onLanguageChange}
            />
          </div>
          <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            {this.state.stack.map((request, index) => (
              <div
                key={index}
                style={{
                  boxShadow: theme.effects.elevation16,
                  padding: "10px",
                  marginBottom: "15px",
                }}
              >
                <CodeView
                  request={request}
                  lightUrl={true}
                  snippetLanguage={this.state.snippetLanguage}
                ></CodeView>
              </div>
            ))}
          </div>
        </header>
      </div>
    );
  }
}

export default DevTools;
