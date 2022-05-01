import * as React from "react";
import { CommandBar } from "@fluentui/react/lib/CommandBar";
import { DefaultPalette, Separator } from "@fluentui/react";

class DevToolsCommandBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const _items = [
      {
        key: "download",
        text: "Save script",
        onClick: this.props.saveScript,
        iconProps: { iconName: "Download" },
      },
      {
        key: "clear",
        text: "Clear session",
        onClick: this.props.clearStack,
        iconProps: { iconName: "Delete" },
      },
    ];

    return (
      <div>
        <CommandBar items={_items} ariaLabel="Save script and clear items" />
      </div>
    );
  }
}

export default DevToolsCommandBar;
