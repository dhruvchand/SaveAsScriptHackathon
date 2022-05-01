import React from "react";
import "./DevTools.css";
import { CodeView } from "../components/CodeView";
import { AppHeader } from "../components/AppHeader";
import { FontSizes } from "@fluentui/theme";
import { PrimaryButton, DefaultPalette, getTheme } from "@fluentui/react";
import { getRequestBody, getCodeView } from "../common/client.js";

const theme = getTheme();

class DevTools extends React.Component {
  constructor() {
    super();
    this.state = {
      stack: [],
    };
  }
  componentDidMount() {
    // Add listener when component mounts
    this.addListener();
  }

  async addRequestToStack(request) {
    const codeView = await getCodeView(request);
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
              Not all Azure Portal blades use the published Graph APIs, this
              means the stack trace will only be displayed on supported blades
              (E.g. Users, Applications, etc.).
            </p>
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
                <CodeView request={request} lightUrl={true}></CodeView>
              </div>
            ))}
          </div>
        </header>
      </div>
    );
  }
}

export default DevTools;
