import React, { useContext, useEffect, useRef } from 'react';
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

function highlightCode(text: string, language: string): string {
  try {
    if (language && language !== 'text' && hljs.getLanguage(language)) {
      return hljs.highlight(text, { language }).value;
    }
    return hljs.highlightAuto(text).value;
  } catch {
    return text;
  }
}

type Props = {
  /** Language for highlighting. */
  language?: "sql" | "bash" | "json" | "yaml" | "ruby" | "python" | "text";
  /** Style properties to pass down to the wrapping div */
  style?: React.CSSProperties;
  /** Code content as a string (preferred, set by remark plugin). */
  code?: string;
  /** Code block content (legacy children approach). */
  children?: React.ReactNode;
  /** Whether to hide the copy button */
  hideCopy?: boolean;
}

const CodeBlock = ({children, code, language = 'text', style, hideCopy = false}: Props) => {
  const codeRef = useRef<HTMLElement>(null);

  // Prefer the `code` prop (plain string, no encoding issues).
  // Fall back to rendering children directly with client-side highlighting.
  const text = code ?? (typeof children === "string" ? children : null);

  useEffect(() => {
    if (text === null && codeRef.current && language !== 'text' && hljs.getLanguage(language)) {
      hljs.highlightElement(codeRef.current);
    }
  }, [language, text]);

  return (
    <div className={styles.copyBlock}>
      <div className='gatsby-highlight' data-language={language}>
        <pre className={`language-${language}`} style={style}>
          {text !== null ? (
            <code
              ref={codeRef}
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlightCode(text, language) }}
            />
          ) : (
            <code ref={codeRef} className={`language-${language}`}>
              {children}
            </code>
          )}
        </pre>
      </div>
     {!hideCopy && (
        <CopyToClipboard
          content={text ?? (() => codeRef.current?.textContent || '')}
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
