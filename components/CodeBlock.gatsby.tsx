import React, { useRef, useEffect, useContext } from 'react';
import CopyToClipboard from "./CopyToClipboard";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/pgsql";
import yaml from "highlight.js/lib/languages/yaml";
import bash from "highlight.js/lib/languages/bash";
import ruby from "highlight.js/lib/languages/ruby";
import python from "highlight.js/lib/languages/python";
import styles from "./style.module.scss";

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
  /** 
   * Language for highlighting. 
   * 
   * Supported languages: sql, bash, json, yaml, graphql, ruby, python, text 
   */ 
  language?: string; 
  /** Style properties to pass down to the wrapping div */ 
  style?: React.CSSProperties; 
  /** Code block content */ 
  children: React.ReactNode; 
  /** Whether to hide the copy button */ 
  hideCopy?: boolean; 
}

const CodeBlock = ({children, language = 'text', style, hideCopy = false}: Props) => {
  const ref = useRef<HTMLElement>();
  useEffect(() => {
    // This matches the prefix used by gatsby-remark-prismjs
    // (Prism is a different highlighter, but is close enough for the CSS to work)
    hljs.configure({ classPrefix: 'token ' });
    hljs.registerLanguage("sql", sql);
    hljs.registerLanguage("json", json);
    hljs.registerLanguage("yaml", yaml);
    hljs.registerLanguage("bash", bash);
    hljs.registerLanguage("ruby", ruby);
    hljs.registerLanguage("python", python);
    hljs.highlightElement(ref.current);
  }, [ref]);
  return (
    <div className={styles.copyBlock}>
      <div className='gatsby-highlight' data-language={language}>
        <pre className={`language-${language}`} style={style}>
          <code className={`language-${language}`} ref={ref}>{getTextFromChildren(children)}</code>
        </pre>
      </div>
     {!hideCopy && (
        <CopyToClipboard
          content={getTextFromChildren(children)}  // Ensure content is passed to the CopyToClipboard component
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
