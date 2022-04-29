import * as React from "react";
import { CommandBar } from "@fluentui/react/lib/CommandBar";
import { DefaultPalette } from "@fluentui/react";

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

export const CommandMenu = () => {
  return (
    <CommandBar
      overflowItems={_overflowItems}
      overflowButtonProps={overflowProps}
      ariaLabel="Clear state and open settings window commands"
      styles={styleBlue}
    />
  );
};

const _overflowItems = [
  {
    key: "settings",
    text: "Settings",
    onClick: () => openOptionsPage(),
    iconProps: { iconName: "Settings" },
  },
];
