import React from "react";
import "./Options.css";
import { AppHeader } from "../components/AppHeader";
import { FontSizes } from "@fluentui/theme";
import { PrimaryButton, DefaultPalette, getTheme } from "@fluentui/react";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

const theme = getTheme();
initializeIcons();
class Options extends React.Component {
  constructor() {
    super();
    this.state = {
      message: "",
      isActive: false,
      stack: [],
    };
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
            <div
              style={{
                boxShadow: theme.effects.elevation8,
                padding: "10px",
                margin: "20px",
              }}
            >
              <h2>Viewing the Graph call stack trace</h2>
              <p>
                To view Graph calls in real-time
                <ul>
                  <li>
                    Browse to the <b>Azure Portal</b>
                  </li>
                  <li>
                    open <b>Developer Tools</b>
                  </li>
                  <li>
                    open the <b>Graph X-Ray panel</b> in Developer Tools
                  </li>
                  <li>
                    make changes in the Azure Portal to record and view the
                    corresponding Graph API calls and PowerShell commands
                  </li>
                </ul>
                <img
                  src="./img/tutorial/graphxraydemo.gif"
                  alt="demo of opening Graph X-Ray panel"
                  style={{
                    boxShadow: theme.effects.elevation8,
                  }}
                ></img>
              </p>
            </div>
            <div
              style={{
                boxShadow: theme.effects.elevation4,
                padding: "10px",
                margin: "20px",
              }}
            >
              <h2>Step by step guide</h2>
              <div
                style={{
                  boxShadow: theme.effects.elevation8,
                  padding: "10px",
                  margin: "20px",
                }}
              >
                <p>
                  <h3>Open Developer Tools</h3>
                  <h4>Using the keyboard</h4>
                  <ul>
                    <li>
                      Press <b>F12</b> on Windows
                    </li>
                    <li>
                      Press <b>Cmd+Opt+I</b> on macOS
                    </li>
                  </ul>
                  <h4>Using the menu</h4>
                  <ul>
                    <li>
                      On Microsoft Edge open the menu from the top right then
                      select <b>Extensions</b>.{" "}
                    </li>
                    <li>
                      On Google Chrome open the menu from the top right then
                      select <b>More Tools</b> and click <b>Extensions</b>.{" "}
                    </li>
                  </ul>
                  <img
                    src="./img/tutorial/Tutorial-1.png"
                    width="400"
                    alt="screenshot of selecting Developer Tools in Edge"
                  ></img>
                </p>
              </div>
              <div
                style={{
                  boxShadow: theme.effects.elevation4,
                  padding: "10px",
                  margin: "20px",
                }}
              >
                <h3>Open the Graph X-Ray panel</h3>
                <p>
                  Expand the tabs in Developer Tools and select the Graph X-Ray
                  panel.
                </p>
                <p>
                  If you don't see the Graph X-Ray panel you may need to restart
                  your browser.
                </p>
                <img
                  src="./img/tutorial/Tutorial-2.png"
                  width="800"
                  alt="screenshot of opening Graph X-Ray pane"
                ></img>
              </div>
              <div
                style={{
                  boxShadow: theme.effects.elevation8,
                  padding: "10px",
                  margin: "20px",
                }}
              >
                <h3>View Graph call stack trace</h3>
                <p>
                  Make changes in the Azure Portal to view the corresponding
                  Graph API calls and PowerShell commands for the action (e.g.
                  edit a user's profile information and click Save).
                </p>
                <p>
                  Scroll down in the Graph X-Ray panel to view the new stack
                  trace.
                </p>
                <img
                  src="./img/tutorial/Tutorial-3.png"
                  width="800"
                  alt="screenshot of viewing graph changes"
                ></img>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default Options;
