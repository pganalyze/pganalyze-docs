import React from 'react';

type Props = {
   language: string;
   style?: React.CSSProperties;
   children: React.ReactNode;
}

const CodeBlock = ({children, language = 'text', style}: Props) => {
  return (
    <div className='gatsby-highlight' data-language={language}>
      <pre className={`language-${language}`} style={style}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock;
