import * as React from "react";
import { CommandBar } from "@fluentui/react/lib/CommandBar";
import { DefaultPalette } from "@fluentui/react";
import { ContextualMenuItemType } from "@fluentui/react/lib/ContextualMenu";

const styleBlue = {
  root: {
    background: DefaultPalette.themeDarker,
  },
  rootHovered: {
    background: DefaultPalette.themeDarker,
  },
  rootExpandedHovered: {
    background: DefaultPalette.themeDarker,
  },
  rootPressedHovered: {
    background: DefaultPalette.themeDarker,
  },
  rootFocused: {
    background: DefaultPalette.themeDarker,
  },
  rootPressed: {
    background: DefaultPalette.themeDarker,
  },
};

const settingsIcon = {
  iconName: "Settings",
  className: "settingsIcon",
};

const overflowProps = {
  menuIconProps: settingsIcon,
  ariaLabel: "More commands",
  styles: styleBlue,
};

export const openOptionsPage = () => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
};

const _overflowItems = [
  {
    key: "history",
    text: "View Graph calls",
    onClick: () => openOptionsPage(),
    iconProps: { iconName: "OpenInNewTab" },
  },
  {
    key: "divider1",
    itemType: ContextualMenuItemType.Divider,
  },
  {
    key: "feedback",
    text: "Feedback",
    onClick: () =>
      window.open("https://github.com/dhruvchand/SaveAsScriptHackathon/issues"),
    iconProps: { iconName: "Feedback" },
  },
];

export const CommandMenu = () => {
  return (
    <div>
      <CommandBar
        overflowItems={_overflowItems}
        overflowButtonProps={overflowProps}
        ariaLabel="Clear state and open settings window commands"
        styles={styleBlue}
      />
    </div>
  );
};
