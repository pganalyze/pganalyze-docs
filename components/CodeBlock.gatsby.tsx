import React, { useRef, useEffect } from 'react';
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/pgsql";

type Props = {
   language: string;
   style?: React.CSSProperties;
   children: React.ReactNode;
}

const CodeBlock = ({children, language = 'text', style}: Props) => {
  const ref = useRef<HTMLElement>();
  useEffect(() => {
    // This matches the prefix used by gatsby-remark-prismjs
    // (Prism is a different highlighter, but is close enough for the CSS to work)
    hljs.configure({ classPrefix: 'token ' });
    hljs.registerLanguage("sql", sql);
    hljs.registerLanguage("json", json);
    hljs.highlightElement(ref.current);
  }, [ref]);
  return (
    <div className='gatsby-highlight' data-language={language}>
      <pre className={`language-${language}`} style={style}>
        <code className={`language-${language}`} ref={ref}>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock;
