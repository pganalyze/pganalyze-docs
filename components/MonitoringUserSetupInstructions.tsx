import React from "react";

import MonitoringUser10 from "../install/_monitoring_user_10.mdx";
import MonitoringUser96 from "../install/_monitoring_user_96.mdx";
import MonitoringUser94 from "../install/_monitoring_user_94.mdx";
import MonitoringUserOld from "../install/_monitoring_user_old.mdx";

type Props = {
  minPostgres: number;
};

const MonitoringUserSetupInstructions: React.FunctionComponent<Props> = ({
  minPostgres = 90200,
}) => {
  return (
    <>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            href="#monitoring_user_10"
            data-toggle="tab"
            className="nav-link active"
          >
            PostgreSQL 10+
          </a>
        </li>
        {minPostgres <= 90600 && (
          <li className="nav-item">
            <a
              href="#monitoring_user_96"
              data-toggle="tab"
              className="nav-link"
            >
              PostgreSQL 9.6
            </a>
          </li>
        )}
        {minPostgres <= 90500 && (
          <li className="nav-item">
            <a
              href="#monitoring_user_94"
              data-toggle="tab"
              className="nav-link"
            >
              PostgreSQL 9.4 and 9.5
            </a>
          </li>
        )}
        {minPostgres <= 90300 && (
          <li className="nav-item">
            <a
              href="#monitoring_user_old"
              data-toggle="tab"
              className="nav-link"
            >
              PostgreSQL 9.3 and older
            </a>
          </li>
        )}
      </ul>
      <div className="tab-content">
        <div className="tab-pane active" id="monitoring_user_10">
          <MonitoringUser10 />
        </div>
        {minPostgres <= 90600 && (
          <div className="tab-pane" id="monitoring_user_96">
            <MonitoringUser96 />
          </div>
        )}
        {minPostgres <= 90500 && (
          <div className="tab-pane" id="monitoring_user_94">
            <MonitoringUser94 />
          </div>
        )}
        {minPostgres <= 90300 && (
          <div className="tab-pane" id="monitoring_user_old">
            <MonitoringUserOld />
          </div>
        )}
      </div>
    </>
  );
};

export default MonitoringUserSetupInstructions;
