import React from 'react'
import { useIcon } from './WithIcons';

const RepositorySigningKey: React.FunctionComponent = () => {
  const SecureIcon = useIcon('secure');
  const keyUrl = 'https://packages.pganalyze.com/pganalyze_signing_key.asc';
  return (
    <div style={{fontSize: '14px', padding: '6px 16px 4px', borderTop: '1px solid gray', borderBottom: '1px solid gray'}}>
      <div>
        <strong>
          <SecureIcon />Repository Signing Key
        </strong>
      </div>
      <div>
        <strong>Fingerprint</strong>: C09B 2CAB 0DB3 78F6 E7FD 93F1 0E6D EC71 A2B5 F2F9 
      </div>
      <div>
        <strong>Download</strong>: <a href={keyUrl}>{keyUrl}</a>
      </div>
    </div>
  )
}

export default RepositorySigningKey;