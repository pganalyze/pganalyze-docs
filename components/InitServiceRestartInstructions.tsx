import React from 'react'

import TabPanel, { TabItem } from './TabPanel'

import { useCodeBlock } from './CodeBlock'

const InitServiceRestartInstructions: React.FunctionComponent<{service:string}> = ({service}) => {
  const CodeBlock = useCodeBlock();
  const tabs: TabItem[] = [
    [ 'systemd', 'Systemd (most common)' ],
    [ 'upstart', 'Upstart' ],
    [ 'sysvinit', 'SysVinit' ],
  ];
  return (
    <TabPanel items={tabs}>
      {(idx: number) => {
        const initSystem = tabs[idx]?.[0];
        const command = initSystem === 'systemd'
          ? `systemctl restart ${service}`
          : initSystem === 'upstart'
          ? `restart ${service}`
          : initSystem === 'sysvinit'
          ? `service ${service} restart`
          : undefined;

        if (!command) {
          return null;
        }
        return <CodeBlock>{command}</CodeBlock>
      }}
    </TabPanel>
  )
}
export default InitServiceRestartInstructions;