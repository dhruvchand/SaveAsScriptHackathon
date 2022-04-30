import { Stack } from "@fluentui/react/lib/Stack";
import { DefaultPalette } from "@fluentui/react";
import { FontSizes } from "@fluentui/theme";
import {
    CommandMenu
  } from "./CommandMenu.js";
  
// Non-mutating styles definition
const stackItemStyles = {
    root: {
      alignItems: "center",
      background: DefaultPalette.themeDarker,
      color: DefaultPalette.white,
      display: "flex",
      height: 50,
      justifyContent: "center",
      overflow: "hidden",
    },
  };
  const nonShrinkingStackItemStyles = {
    root: {
      alignItems: "center",
      background: DefaultPalette.themeDarker,
      color: DefaultPalette.white,
      height: 50,
      display: "flex",
      justifyContent: "start",
      overflow: "hidden",
      paddingLeft: "10px",
    },
  };
  
export const AppHeader = ({hideSettings}) => {
    return (
  
      <Stack horizontal>
        <Stack.Item grow styles={stackItemStyles}>
          <img alt="logo" src="./img/icon-16.svg" height="22px"></img>
        </Stack.Item>
        <Stack.Item
          grow={10}
          styles={nonShrinkingStackItemStyles}
          disableShrink
        >
          <div
            style={{
              fontSize: FontSizes.size16,
              fontWeight: 600,
            }}
          >
            Microsoft Graph X-Ray
          </div>
        </Stack.Item>
        <Stack.Item grow styles={stackItemStyles}>
        {!hideSettings &&
          <CommandMenu></CommandMenu>
        }
        </Stack.Item>
      </Stack>

);
};
