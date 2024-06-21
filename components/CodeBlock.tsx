import React, { useContext } from 'react'

type Props = {
  // ignored for now in this implementation but still accepted
  language?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const CodeBlock = ({style, children}: Props) => {
  return (
    <pre style={style}>
      <code>{children}</code>
    </pre>
  )
}

const CodeBlockContext = React.createContext<React.ComponentType<Props>>(CodeBlock);

export const WithCodeBlock = ({component, children}: {
  component: React.ComponentType<Props>;
  children: React.ReactNode;
}) => {
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
