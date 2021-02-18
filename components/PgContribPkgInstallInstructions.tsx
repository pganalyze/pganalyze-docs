import React from 'react'
import { useCodeBlock } from './CodeBlock';

import TabPanel, { TabItem } from './TabPanel'

const PgContribPkgInstallInstructions: React.FunctionComponent = () => {
  const versions: string[] = [ '13', '12', '11', '10', '9.6' ];
  const tabs = versions.map<TabItem>(version => {
    const id = `pg${version.replace(/\D/, '')}`
    const label = `Postgres ${version}`
    return [ id, label ]
  })
  const CodeBlock = useCodeBlock();
  return (
    <TabPanel items={tabs}>
      {(idx: number) => {
        const version = versions[idx];
        return (
          <CodeBlock>sudo apt-get install postgresql-contrib-{version}</CodeBlock>
        )
      }}
    </TabPanel>
  )
}

export default PgContribPkgInstallInstructions;
