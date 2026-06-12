import React, { useContext } from 'react'
import CopyCodeButton from './CopyCodeButton';

// The copy button rendered by CodeBlock. Consumers inject their own button
// (e.g. the in-app build supplies one styled with the app's Button component)
// via WithCopyButton; the default is CopyCodeButton, a framework-agnostic Web
// Component used on the public docs site (works without React hydration).
export type CopyButtonProps = {
  className?: string;
  content: string | (() => string | Promise<string>);
  label: string;
  title?: string;
};

const CopyButtonContext = React.createContext<React.ComponentType<CopyButtonProps>>(CopyCodeButton);

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
