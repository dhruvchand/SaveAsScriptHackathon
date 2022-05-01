const devxEndPoint =
  "https://graphexplorerapi.azurewebsites.net/api/graphexplorersnippets";

const getPowershellCmd = async function (snippetLanguage, method, url, body) {
  if (url.includes("$batch")) {
    console.log("Batch graph call. Ignoring for code snippet.");
    return null;
  }

  console.log("Get code snippet from DevX:", url, method);
  const bodyText = body ?? ""; //Cast undefined and null to string
  const path = url.split("/graph.microsoft.com")[1];
  const payload = `${method} ${path} HTTP/1.1\r\nHost: graph.microsoft.com\r\nContent-Type: application/json\r\n\r\n${bodyText}`;
  console.log("Payload:", payload);

  const snippetParam = "?lang=%snippetLanguage%".replace(
    "%snippetLanguage%",
    snippetLanguage
  );
  const openApiParam = "&generation=openapi";

  let devxSnippetUri = devxEndPoint;
  if (snippetLanguage === "c#") {
    devxSnippetUri = devxEndPoint;
  } else if (["javascript", "java", "objective-c"].includes(snippetLanguage)) {
    devxSnippetUri = devxEndPoint + snippetParam;
  } else if (["go", "powershell"].includes(snippetLanguage)) {
    devxSnippetUri = devxEndPoint + snippetParam + openApiParam;
  }

  try {
    const response = await fetch(devxSnippetUri, {
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

const getCodeView = async function (snippetLanguage, request) {
  if (["OPTIONS"].includes(request.method)) {
    return null;
  }
  console.log("GetCodeView", snippetLanguage, request);
  const requestBody = getRequestBody(request);
  const code = await getPowershellCmd(
    snippetLanguage,
    request.method,
    request.url,
    requestBody
  );
  const codeView = {
    displayRequestUrl: request.method + " " + request.url,
    code: code,
  };
  console.log("CodeView", codeView);
  return codeView;
};
export { getPowershellCmd, getRequestBody, getCodeView };
