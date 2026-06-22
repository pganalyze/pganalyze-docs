import React, { useEffect, useRef } from 'react';
import CopyCodeButton from "./CopyCodeButton";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import sql from "highlight.js/lib/languages/pgsql";
import yaml from "highlight.js/lib/languages/yaml";
import bash from "highlight.js/lib/languages/bash";
import ruby from "highlight.js/lib/languages/ruby";
import python from "highlight.js/lib/languages/python";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import ini from "highlight.js/lib/languages/ini";
import shell from "highlight.js/lib/languages/shell";
import styles from "./style.module.scss";

// The stock INI grammar tags any digit run in a value as a `number` token. In
// our config snippets those digits are almost always part of a hostname (e.g.
// `mydbcluster.cluster-123456789012.us-east-1...`), so highlighting them just
// chops the value into oddly-colored fragments. Wrap the grammar and strip the
// `number` mode out of every `contains`/`starts` so values render as plain text.
function iniWithoutNumbers(hljs: typeof import("highlight.js").default) {
  const lang = ini(hljs);
  const stripNumbers = (mode: any) => {
    if (!mode || typeof mode !== "object") return;
    if (Array.isArray(mode.contains)) {
      mode.contains = mode.contains.filter(
        (m: any) => !(m && m.className === "number")
      );
      mode.contains.forEach(stripNumbers);
    }
    if (mode.starts) stripNumbers(mode.starts);
  };
  stripNumbers(lang);
  return lang;
}

// Register languages once at module load
hljs.configure({ classPrefix: 'token ' });
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("json", json);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("python", python);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("ini", iniWithoutNumbers);
hljs.registerLanguage("shell", shell); // "Shell Session" — highlights prompt+command, leaves output plain (aliases: console, shellsession)

// Returns highlighted HTML for languages we explicitly support, or null when
// there's nothing to highlight — `text`, an untagged fenced block (which
// arrives here as "text"), or an unregistered language. We deliberately do NOT
// fall back to hljs.highlightAuto(), which guesses a language and produces
// spurious tokens. A null result is rendered as a plain React child, so React
// handles HTML escaping (no hand-rolled escaper, and dangerouslySetInnerHTML
// only ever receives highlight.js's own already-escaped output).
function highlightCode(text: string, language: string): string | null {
  if (language && language !== "text" && hljs.getLanguage(language)) {
    try {
      return hljs.highlight(text, { language }).value;
    } catch {
      // fall through to plain rendering
    }
  }
  return null;
}

// Recursively extract code text from children so it can be highlighted
// synchronously (SSR-safe). Handles the shapes CodeBlock receives directly:
//   - plain strings / numbers
//   - arrays / interpolated children (e.g. `{`...${x}...`}` in a JSX context)
//   - React elements wrapping text (recurse into props.children)
// Top-level MDX `<CodeBlock>{`...`}</CodeBlock>` never reaches here as a string:
// the remark plugin hoists its child into the `code` prop, so it doesn't pass
// through Astro's slot pipeline. Returns "" when there's no extractable text
// (e.g. a self-rendering element like <SQL sql=.../> that keeps its code in a
// non-children prop) — the caller then renders the children directly.
function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  const props = (node as any)?.props;
  if (props && props.children !== undefined) return extractText(props.children);
  return "";
}

/** Languages we explicitly support for syntax highlighting. */
export type Language = "sql" | "bash" | "json" | "yaml" | "ruby" | "python" | "dockerfile" | "ini" | "console" | "text";

type Props = {
  /** Language for highlighting. */
  language?: Language;
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

  // Prefer the `code` prop (plain string — set by the remark plugin for fenced
  // blocks and for inline MDX `<CodeBlock>{`...`}`). Otherwise extract plain-text
  // children and highlight them the same way, synchronously, so it works during
  // SSR (Astro renders docs statically, so a useEffect-based highlight would
  // never run). Children with no extractable text (e.g. a self-rendering
  // <SQL sql=.../>) yield "" → null, and fall back to rendering children directly.
  const extracted = extractText(children);
  const text = code ?? (extracted.trim() !== "" ? extracted : null);
  const highlighted = text !== null ? highlightCode(text, language) : null;

  useEffect(() => {
    if (text === null && codeRef.current && language !== 'text' && hljs.getLanguage(language)) {
      hljs.highlightElement(codeRef.current);
    }
  }, [language, text]);

  return (
    <div className={styles.copyBlock}>
      <div className='gatsby-highlight' data-code-block data-language={language}>
        <pre className={`language-${language}`} style={style}>
          {text === null ? (
            // No extractable text (e.g. a self-rendering <SQL/>): render children.
            <code ref={codeRef} className={`language-${language}`}>
              {children}
            </code>
          ) : highlighted !== null ? (
            // Highlighted: highlight.js output is already HTML-escaped.
            <code
              ref={codeRef}
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          ) : (
            // Plain text (text / untagged / unregistered): React escapes it.
            <code ref={codeRef} className={`language-${language}`}>
              {text}
            </code>
          )}
        </pre>
      </div>
     {!hideCopy && <CopyCodeButton className={styles.copyIcon} />}
    </div>
  )
}

export default CodeBlock;
