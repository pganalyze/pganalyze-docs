import React from 'react';

type Props = {
   language: string;
   style?: React.CSSProperties;
}

const CodeBlock: React.FunctionComponent<Props> = ({children, language = 'text', style}) => {
  return (
    <div className='gatsby-highlight' data-language={language}>
      <pre className={`language-${language}`} style={style}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock;
