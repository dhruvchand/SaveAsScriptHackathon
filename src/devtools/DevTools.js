import React from "react";
import "./DevTools.css";
import { CodeView } from "../components/CodeView";
import { AppHeader } from "../components/AppHeader";
import { FontSizes } from "@fluentui/theme";
import { PrimaryButton, DefaultPalette, getTheme } from "@fluentui/react";
import { getRequestBody, getCodeView } from "../common/client.js";
import { Dropdown } from "@fluentui/react/lib/Dropdown";
import DevToolsCommandBar from "../components/DevToolsCommandBar";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { Layer, LayerHost } from "@fluentui/react/lib/Layer";

const theme = getTheme();
initializeIcons();

const dropdownStyles = {
  dropdown: { width: 300 },
};

const options = [
  { key: "powershell", text: "PowerShell", fileExt: "ps1" },
  { key: "c#", text: "C#", fileExt: "cs" },
  { key: "javascript", text: "JavaScript", fileExt: "js" },
  { key: "java", text: "Java", fileExt: "java" },
  { key: "objective-c", text: "Objective-C", fileExt: "c" },
  { key: "go", text: "Go", fileExt: "go" },
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
    this.addListenerGraph();
  }

  clearStack = () => {
    this.setState({ stack: [] });
  };

  saveScript = () => {
    const script = this.getSaveScriptContent();
    const languageOpt = options.filter((opt) => {
      return opt.key === this.state.snippetLanguage;
    });
    const fileName = "GraphXRaySession." + languageOpt[0].fileExt;
    this.downloadFile(script, fileName);
  };

  copyScript = () => {
    const script = this.getSaveScriptContent();
    navigator.clipboard.writeText(script);
  };

  getSaveScriptContent() {
    let script = "";
    this.state.stack.forEach((request) => {
      if (request.code) {
        script += "\n\n" + request.code;
      }
    });
    return script;
  }

  downloadFile(content, filename) {
    const element = document.createElement("a");
    const file = new Blob([content], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  }

  addListenerGraph() {
    window.chrome.webview.addEventListener("message", (event) => {
      console.log("Got message from host!");
      console.log(event.data);
      const msg = JSON.parse(event.data);
      if (msg.eventName === "GraphCall") {
        console.log("Showing graph call.");
        this.showRequest(msg);
      }
    });
  }

  async addRequestToStack(request, version) {
    const codeView = await getCodeView(
      this.state.snippetLanguage,
      request,
      version
    );
    if (codeView) {
      this.setState({ stack: [...this.state.stack, codeView] });
    }
  }

  async getBatchRequests(request, requestBody) {
    const version = request.url.split("/$batch")[0];
    let requests = JSON.parse(requestBody)?.requests;
    let calls = await Promise.all(
      requests.map(async (request) => {
        await this.addRequestToStack(request, version);
      })
    );
  }

  addListener() {
    if (!chrome.devtools) {
      return;
    }
    chrome.devtools.network.onRequestFinished.addListener(async (request) => {
      try {
        if (
          request.request &&
          request.request.url &&
          request.request.url.includes("https://graph.microsoft.com")
        ) {
          request = request.request;

          try {
            this.showRequest(request);
          } catch (error) {
            console.error(error);
          }
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  async showRequest(request) {
    let requestBody = getRequestBody(request);
    if (request.url.includes("/$batch") && requestBody) {
      await this.getBatchRequests(request, requestBody);
    } else {
      await this.addRequestToStack(request);
    }
  }

  onLanguageChange = (e, option) => {
    this.setState({ snippetLanguage: option.key });
    this.clearStack();
  };
  render() {
    return (
      <div className="App" style={{ fontSize: FontSizes.size12 }}>
        <Layer>
          <div
            style={{
              boxShadow: theme.effects.elevation4,
            }}
          >
            <AppHeader hideSettings={true}></AppHeader>
            <DevToolsCommandBar
              clearStack={this.clearStack}
              saveScript={this.saveScript}
              copyScript={this.copyScript}
            ></DevToolsCommandBar>
          </div>
        </Layer>
        <header className="App-header">
          <div
            style={{
              boxShadow: theme.effects.elevation16,
              padding: "10px",
              marginTop: "80px",
              marginBottom: "15px",
            }}
          >
            <h2>Graph Call Stack Trace</h2>
            <p>
              Displays the Graph API calls that are being made by the current
              browser tab. This functionality is available on Azure Active
              Directory blades that use Graph API (E.g. Users, Groups,
              Enterprise Applications, Administrative Units, etc).
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
          {this.state.stack && this.state.stack.length > 0 && (
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
          )}
        </header>
      </div>
    );
  }
}

export default DevTools;
