import React, { useContext } from 'react'
import Null from './Null';

type Icons = {
  okay: React.ComponentType;
  changeRequired: React.ComponentType;
  info: React.ComponentType;
  externalLink: React.ComponentType;
  secure: React.ComponentType;
}

const IconContext = React.createContext<Icons>({
  okay: Null,
  changeRequired: Null,
  info: Null,
  externalLink: Null,
  secure: Null,
});

const WithIcons: React.FunctionComponent<{icons: Icons}> = ({icons, children}) => {
  return (
    <IconContext.Provider value={icons}>
      {children}
    </IconContext.Provider>
  )
}

export const useIcon = (kind: keyof Icons): React.ComponentType => {
  return useContext(IconContext)[kind];
}

export default WithIcons;
