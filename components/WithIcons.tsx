import React, { useContext } from 'react'
import Null from './Null';

export type IconProps = {
  className?: string;
}

type Icons = {
  okay: React.ComponentType<IconProps>;
  changeRequired: React.ComponentType<IconProps>;
  info: React.ComponentType<IconProps>;
  externalLink: React.ComponentType<IconProps>;
  secure: React.ComponentType<IconProps>;
}

const IconContext = React.createContext<Icons>({
  okay: Null,
  changeRequired: Null,
  info: Null,
  externalLink: Null,
  secure: Null,
});

const WithIcons = ({icons, children}: {icons: Icons, children: React.ReactNode}) => {
  return (
    <IconContext.Provider value={icons}>
      {children}
    </IconContext.Provider>
  )
}

export const useIcon = (kind: keyof Icons): React.ComponentType<IconProps> => {
  return useContext(IconContext)[kind];
}

export default WithIcons;
