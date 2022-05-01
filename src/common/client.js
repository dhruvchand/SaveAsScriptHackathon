const ENDPOINT =
  "https://graphexplorerapi.azurewebsites.net/api/graphexplorersnippets?lang=powershell&generation=openapi";

const getPowershellCmd = async function (method, url, body) {
  if (url.includes("$batch")) {
    console.log("Batch graph call. Ignoring for code snippet.");
    return null;
  }

  console.log("Get code snippet from DevX:", url, method);
  const bodyText = body ?? ""; //Cast undefined and null to string
  const path = url.split("/graph.microsoft.com")[1];
  const payload = `${method} ${path} HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json\r\n\r\n${bodyText}`;
  console.log("Payload:", payload);
  try {
    const response = await fetch(ENDPOINT, {
      headers: {
        "content-type": "application/http",
      },
      method: "POST",
      body: payload,
    });
    console.log("DevX responded");
    if (response.ok) {
      const resp = response.text();
      console.log("DevX-Reponse", resp);
      return resp;
    } else {
      console.error(`DevXError : for ${url} "`, response.status);
      return null;
    }
  } catch (error) {
    console.error(error);
  }
};

const getRequestBody = function (request) {
  let requestBody = "";
  if (request.postData && request.postData.text) {
    requestBody = request.postData.text;
  }
  return requestBody;
};

const getCodeView = async function (request) {
  if (["OPTIONS"].includes(request.method)) {
    return null;
  }
  console.log("GetCodeView", request);
  const requestBody = getRequestBody(request);
  const code = await getPowershellCmd(request.method, request.url, requestBody);
  const codeView = {
    displayRequestUrl: request.method + " " + request.url,
    code: code,
  };
  console.log("CodeView", codeView);
  return codeView;
};
export { getPowershellCmd, getRequestBody, getCodeView };
