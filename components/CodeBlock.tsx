import React, { useContext } from 'react'

type Props = {
  // ignored for now in this implementation but still accepted
  language?: string
  style?: React.CSSProperties
}

const CodeBlock: React.FunctionComponent<Props> = ({style, children}) => {
  return (
    <pre style={style}>
      <code>{children}</code>
    </pre>
  )
}

const CodeBlockContext = React.createContext<React.ComponentType<Props>>(CodeBlock);

export const WithCodeBlock: React.FunctionComponent<{component: React.ComponentType<Props>}> = ({component, children}) => {
  return (
    <CodeBlockContext.Provider value={component}>
      {children}
    </CodeBlockContext.Provider>
  )
}

export const useCodeBlock = () => {
  return useContext(CodeBlockContext);
}

export default CodeBlock;