import React from 'react'
import { useCodeBlock } from './CodeBlock'

import RepositorySigningKey from './RepositorySigningKey'

type Props = {
  apiKey?: string
  guided?: boolean
}

const CollectorInstallInstructions: React.FunctionComponent<Props> = ({apiKey, guided}) => {
  const env = {};
  if (apiKey) {
    env['PGA_API_KEY'] = apiKey
  }
  if (guided) {
    env['PGA_API_GUIDED_SETUP'] = 'true'
  }

  return <CollectorEnvInstallInstructions env={env} />
}

const CollectorEnvInstallInstructions: React.FunctionComponent<{
  env: { [key: string]: string }
}> = ({env}) => {
  const CodeBlock = useCodeBlock();
  let bashCmd: string;
  if (Object.keys(env).length === 0) {
    bashCmd = 'bash';
  } else {
    bashCmd = Object.entries(env).reduce((cmdStr, [ nextKey, nextVal ]) => {
      return cmdStr + ` ${nextKey}=${nextVal}`
    }, 'env') + ' bash'
  }
  return (
    <>
      <p>
        We recommend running our install script to automatically detect your platform and
        install the correct package:
      </p>
      <CodeBlock>
        curl https://packages.pganalyze.com/collector-install.sh | {bashCmd}
      </CodeBlock>
      <RepositorySigningKey small />
      <p>
        Alternately, you can follow the <a href="https://pganalyze.com/docs/collector/packages">manual install instructions</a>.
      </p>
    </>
  )
}

export default CollectorInstallInstructions;