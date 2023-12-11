import React, { useRef } from "react";

// TODO: Support using this component in-app by not having a hard-coded website reference
import CodeBlock from "../CodeBlock.gatsby";
import CopyToClipboard from "../CopyToClipboard";

import styles from "./style.module.scss";

const CopyCodeBlock: React.FunctionComponent<{
  content: string;
  language?: string;
  style?: React.CSSProperties;
}> = ({ content, language, style }) => {
  const ref = useRef<HTMLDivElement>();
  return (
    <div className={styles.copyBlock}>
      <div ref={ref}>
        <CodeBlock language={language} style={style}>{content}</CodeBlock>
      </div>
      <CopyToClipboard
        content={content}
        label="copy"
        className={styles.copyIcon}
      />
    </div>
  );
};

export default CopyCodeBlock;
