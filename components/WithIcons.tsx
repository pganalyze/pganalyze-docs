import React, { useContext } from 'react'
import Null from './Null';
import { FontAwesomeIcon } from './FontAwesomeIcon';
import { faLock } from '@fortawesome/pro-solid-svg-icons';

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

const SecureIcon: React.FunctionComponent<IconProps> = ({ className }) => (
  <FontAwesomeIcon icon={faLock} className={className} />
);

const IconContext = React.createContext<Icons>({
  okay: Null,
  changeRequired: Null,
  info: Null,
  externalLink: Null,
  secure: SecureIcon,
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
