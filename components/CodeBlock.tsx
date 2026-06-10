import React, { useContext } from 'react'
import StyledCodeBlock, { Language } from './CodeBlock.gatsby'

type Props = {
  // ignored for now in this implementation but still accepted
  language?: Language;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const CodeBlockContext = React.createContext<React.ComponentType<Props>>(StyledCodeBlock);

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

export default StyledCodeBlock;
