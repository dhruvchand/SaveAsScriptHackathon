import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const ENDPOINT =
  "https://graphexplorerapi.azurewebsites.net/api/graphexplorersnippets?lang=powershell&generation=openapi";

const config = {
  headers: {
    "content-type": "application/http",
  },
};

const getPowershellCmd = async function (method, url) {
  const path = url.split("/graph.microsoft.com")[1];
  const payload = `${method} ${path} HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json\r\n\r\n`;

  try {
    const response = await axios.post(ENDPOINT, payload, config);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { getPowershellCmd };

// fetch("https://graphexplorerapi.azurewebsites.net/api/graphexplorersnippets?lang=powershell&generation=openapi", {
//   "headers": {
//     "accept": "*/*",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "content-type": "application/http",
//     "pragma": "no-cache",
//     "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\", \"Microsoft Edge\";v=\"100\"",
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": "\"Windows\"",
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "cross-site"
//   },
//   "referrer": "https://developer.microsoft.com/",
//   "referrerPolicy": "strict-origin-when-cross-origin",
//   "body": "GET /v1.0/me/messages HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json\r\n\r\n",
//   "method": "POST",
//   "mode": "cors",
//   "credentials": "omit"
// });
