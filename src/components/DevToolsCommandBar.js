import * as React from "react";
import { CommandBar } from "@fluentui/react/lib/CommandBar";
import { DefaultPalette, Separator } from "@fluentui/react";

const _items = [
  {
    key: "download",
    text: "Save Script",
    onClick: () => saveScript(),
    iconProps: { iconName: "Download" },
  },
  {
    key: "clear",
    text: "Clear",
    onClick: () => clearStack(),
    iconProps: { iconName: "Delete" },
  },
];

export const clearStack = () => {};
export const saveScript = () => {};

export const DevToolsCommandBar = () => {
  return (
    <div>
      <CommandBar items={_items} ariaLabel="Save script and clear items" />
    </div>
  );
};
