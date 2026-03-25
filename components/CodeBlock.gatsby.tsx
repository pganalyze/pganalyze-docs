import React, { useContext } from 'react';
import CopyToClipboard from "./CopyToClipboard";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/pgsql";
import yaml from "highlight.js/lib/languages/yaml";
import bash from "highlight.js/lib/languages/bash";
import ruby from "highlight.js/lib/languages/ruby";
import python from "highlight.js/lib/languages/python";
import styles from "./style.module.scss";

// Register languages once at module load
hljs.configure({ classPrefix: 'token ' });
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("python", python);

// Utility to extract text from children
function getTextFromChildren(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join(" \n");
  }
  if (typeof children === "object" && children && "props" in children) {
    return getTextFromChildren((children as any).props.children);
  }
  return "";
}

type Props = {
  /** Language for highlighting. */
  language?: "sql" | "bash" | "json" | "yaml" | "ruby" | "python" | "text";
  /** Style properties to pass down to the wrapping div */
  style?: React.CSSProperties;
  /** Code block content */
  children: React.ReactNode;
  /** Whether to hide the copy button */
  hideCopy?: boolean;
}

const CodeBlock = ({children, language = 'text', style, hideCopy = false}: Props) => {
  const text = getTextFromChildren(children);

  // Highlight synchronously so it works during SSR (no useEffect needed)
  let highlightedHtml: string;
  try {
    if (language && language !== 'text' && hljs.getLanguage(language)) {
      highlightedHtml = hljs.highlight(text, { language }).value;
    } else {
      highlightedHtml = hljs.highlightAuto(text).value;
    }
  } catch {
    highlightedHtml = text;
  }

  return (
    <div className={styles.copyBlock}>
      <div className='gatsby-highlight' data-language={language}>
        <pre className={`language-${language}`} style={style}>
          <code
            className={`language-${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
     {!hideCopy && (
        <CopyToClipboard
          content={text}
          label=""
          className={styles.copyIcon}
        />
      )}
    </div>
  )
}

const CodeBlockContext = React.createContext<React.ComponentType<Props>>(CodeBlock);

export const useCodeBlock = () => {
  return useContext(CodeBlockContext);
}

export default CodeBlock;
