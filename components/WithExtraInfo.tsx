import React, { useContext } from 'react'
import Null from './Null';

type ExtraInfoProps = {
  className: string
  info: string
};

const ExtraInfoContext = React.createContext<React.ComponentType<ExtraInfoProps>>(Null);

const WithExtraInfo: React.FunctionComponent<{extraInfo: React.ComponentType<ExtraInfoProps>}> = ({extraInfo, children}) => {
  return (
    <ExtraInfoContext.Provider value={extraInfo}>
      {children}
    </ExtraInfoContext.Provider>
  )
}

export const useExtraInfo = (): React.ComponentType<ExtraInfoProps> => {
  return useContext(ExtraInfoContext);
}

export default WithExtraInfo;
