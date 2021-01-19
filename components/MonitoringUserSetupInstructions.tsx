import React from "react";

import TabPanel, { TabItem } from './TabPanel'
import MonitoringUser10 from "../install/_monitoring_user_10.mdx";
import MonitoringUser96 from "../install/_monitoring_user_96.mdx";
import MonitoringUser94 from "../install/_monitoring_user_94.mdx";

type Props = {
  minPostgres: number;
};

const MonitoringUserSetupInstructions: React.FunctionComponent<Props> = ({
  minPostgres = 90200,
}) => {
  type SetupOpt = [ id: string, version: number, label: string, instructions: React.ComponentType ];
  const opts: SetupOpt[] = [
    [ 'monitoring_user_10', 100000, 'PostgreSQL 10+', MonitoringUser10 ],
    [ 'monitoring_user_96', 90600, 'PostgreSQL 9.6', MonitoringUser96 ],
    [ 'monitoring_user_94', 90500, 'PostgreSQL 9.4 and 9.5', MonitoringUser94 ],
  ].filter(([_id, version, _label ]) => minPostgres <= version) as SetupOpt[];

  const tabs = opts.map<TabItem>(opt => [opt[0], opt[2]])
  return (
    <TabPanel items={tabs}>
      {(idx: number) => {
        const ActiveTab = opts[idx][3];
        return <ActiveTab />
      }}
    </TabPanel>
  );
};

export default MonitoringUserSetupInstructions;
