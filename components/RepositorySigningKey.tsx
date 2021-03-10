import React from 'react'
import { useIcon } from './WithIcons';

import styles from './style.module.scss';

type Props = {
  small?: boolean
}

const KEY_URL = 'https://packages.pganalyze.com/pganalyze_signing_key.asc';

const RepositorySigningKey: React.FunctionComponent<Props> = ({small}) => {
  return (
    <div style={{fontSize: '14px', padding: '6px 16px 4px', borderTop: '1px solid gray', borderBottom: '1px solid gray', marginBottom: '16px'}}>
      {small ? <SmallKey /> : <Key />}
    </div>
  )
}

const SmallKey: React.FunctionComponent = () => {
  const SecureIcon = useIcon('secure');
  return (
    <div>
      <strong>
        <SecureIcon className={styles.secureIcon} />Repository Signing Key Fingerprint
      </strong>: C09B 2CAB 0DB3 78F6 E7FD 93F1 0E6D EC71 A2B5 F2F9
    </div>
  )
}

const Key: React.FunctionComponent = () => {
  const SecureIcon = useIcon('secure');
  return (
    <>
      <div>
        <strong>
          <SecureIcon className={styles.secureIcon} />Repository Signing Key
        </strong>
      </div>
      <div>
        <strong>Fingerprint</strong>: C09B 2CAB 0DB3 78F6 E7FD 93F1 0E6D EC71 A2B5 F2F9 
      </div>
      <div>
        <strong>Download</strong>: <a href={KEY_URL}>{KEY_URL}</a>
      </div>
    </>
  )
}

export default RepositorySigningKey;
