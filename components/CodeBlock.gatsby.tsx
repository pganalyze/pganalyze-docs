import React from 'react'

type Props = {
   language: string
}

const CodeBlock: React.FunctionComponent<Props> = ({children, language = 'text'}) => {
  return (
    <div className='gatsby-highlight' data-language={language}>
      <pre className={`language-${language}`}>
        <code className={`language-${language}`}>{children}</code>
      </pre>
    </div>
  )
}

export default CodeBlock;
