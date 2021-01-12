import React from 'react'

type Props = {
  // ignored for now in this implementation but still accepted
  language: string
}

const CodeBlock: React.FunctionComponent<Props> = ({children}) => {
  return (
    <pre>
      <code>{children}</code>
    </pre>
  )
}

export default CodeBlock;