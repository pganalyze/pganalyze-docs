import React, { useContext } from 'react'
import CopyToClipboard from './CopyToClipboard';

// The copy button rendered by CodeBlock. Consumers inject their own button
// (e.g. the in-app build supplies one styled with the app's Button component)
// via WithCopyButton; the default is our own CopyToClipboard, used on the
// public docs site.
export type CopyButtonProps = {
  className?: string;
  content: string | (() => string | Promise<string>);
  label: string;
  title?: string;
};

const CopyButtonContext = React.createContext<React.ComponentType<CopyButtonProps>>(CopyToClipboard);

const WithCopyButton = ({button, children}: {
  button: React.ComponentType<CopyButtonProps>;
  children: React.ReactNode;
}) => {
  return (
    <CopyButtonContext.Provider value={button}>
      {children}
    </CopyButtonContext.Provider>
  )
}

export const useCopyButton = (): React.ComponentType<CopyButtonProps> => {
  return useContext(CopyButtonContext);
}

export default WithCopyButton;
