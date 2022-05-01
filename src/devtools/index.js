import React from "react";
import ReactDOM from "react-dom";
import DevTools from "./DevTools.js";

ReactDOM.render(
  <React.StrictMode>
    <DevTools />
  </React.StrictMode>,
  document.getElementById("devtools")
);
