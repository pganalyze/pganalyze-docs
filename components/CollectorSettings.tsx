import React from 'react'
import { useCodeBlock } from './CodeBlock'

type CollectorSetting = [ name: string, value: string ];

const CollectorSettings: React.FunctionComponent<{settings: CollectorSetting[], configFromEnv?: boolean}> = ({settings, configFromEnv}) => {
  if (configFromEnv == null) {
    return (
      <div>
        <p>
          If using the config file, make the following changes to your <code>pganalyze-collector.conf</code>:
        </p>
        <CollectorConfigFileSettings settings={settings} />
        <p>
          If running the collector in a container, set these environment variables instead:
        </p>
        <CollectorEnvConfigSettings settings={settings} />
      </div>
    )
  } else if (configFromEnv) {
    return (
      <div>
        <p>Set the following environment variables for your container:</p>
        <CollectorEnvConfigSettings settings={settings} />
      </div>
    )
  } else if (!configFromEnv) {
    return (
      <div>
        <p>Make the following changes to your <code>pganalyze-collector.conf</code>:</p>
        <CollectorConfigFileSettings settings={settings} />
      </div>
    )
  } else {
    return null;
  }
}

const CollectorConfigFileSettings: React.FunctionComponent<{settings: CollectorSetting[]}> = ({settings}) => {
  const CodeBlock = useCodeBlock();
  return (
    <CodeBlock>
      {settings.map(([setting, value]) => {
        return `${setting}: ${value}`
      }).join("\n")}
    </CodeBlock>
  )
}

const CollectorEnvConfigSettings: React.FunctionComponent<{settings: CollectorSetting[]}> = ({settings}) => {
  // We go into the `pganalyze-collector.conf` configuration file
  return (
    <ul>
      {settings.map(([setting, value]) => {
        return (
          <li>
            <code>{toEnvSetting(setting)}={value}</code>
          </li>
        )
      })}
    </ul>
  )
}

function toEnvSetting(configFileSetting: string):string {
  switch (configFileSetting) {
    case 'api_base_url':
      return 'PGA_API_BASEURL';
    case 'db_log_location':
      return 'LOG_LOCATION';
    case 'aws_db_instance_id':
      return 'AWS_INSTANCE_ID';
    case 'api_key':
    case 'enable_log_explain':
    case 'api_system_id':
    case 'api_system_type':
    case 'api_system_scope':
    case 'api_system_scope_fallback':
    case 'disable_logs':
    case 'disable_activity':
      return 'PGA_' + configFileSetting.toUpperCase();
    default:
      return configFileSetting.toUpperCase();
  }  
}

export default CollectorSettings