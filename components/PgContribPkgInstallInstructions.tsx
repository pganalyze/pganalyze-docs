import React from 'react'

import TabPanel, { TabItem } from './TabPanel'

const PgContribPkgInstallInstructions: React.FunctionComponent = () => {
  const versions: string[] = [ '11', '10', '9.6', '9.5', '9.4' ];
  const tabs = versions.map<TabItem>(version => {
    const id = `pg${version.replace(/\D/, '')}`
    const label = `Postgres ${version}`
    return [ id, label ]
  })
  return (
    <TabPanel items={tabs}>
      {(idx: number) => {
        const version = versions[idx];
        return (
          <pre>
            <code>sudo apt-get install postgresql-contrib-{version}</code>
          </pre>
        )
      }}
    </TabPanel>
  )
}

export default PgContribPkgInstallInstructions;
