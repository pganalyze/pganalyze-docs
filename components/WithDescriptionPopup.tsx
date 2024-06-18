import React, { useContext } from 'react'
import Null from './Null';

export type DescriptionPopupProps = {
  className: string
  info: string
};

const DescriptionPopupContext = React.createContext<React.ComponentType<DescriptionPopupProps>>(Null);

const WithDescriptionPopup = ({popup, children}: {popup: React.ComponentType<DescriptionPopupProps>, children: React.ReactNode}) => {
  return (
    <DescriptionPopupContext.Provider value={popup}>
      {children}
    </DescriptionPopupContext.Provider>
  )
}

export const useDescriptionPopup = (): React.ComponentType<DescriptionPopupProps> => {
  return useContext(DescriptionPopupContext);
}

export default WithDescriptionPopup;
