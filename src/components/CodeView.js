import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark, atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

export const CodeView = ({httpRequest, code, lightUrl}) => {
    let urlStyle = atomOneDark;
    if(lightUrl){
        urlStyle = atomOneLight;
    }
    return (
        <div>
            {httpRequest && httpRequest.length > 0 &&
            <SyntaxHighlighter
            language="jboss-cli"
            style={urlStyle}
            wrapLongLines={true}
        >
            {httpRequest}
        </SyntaxHighlighter>
}
        {code && code.length > 0 &&
        <SyntaxHighlighter
            language="powershell"
            style={atomOneDark}
            wrapLongLines={true}
        >
            {code}
        </SyntaxHighlighter>
        }
      </div>
    );
  };
  