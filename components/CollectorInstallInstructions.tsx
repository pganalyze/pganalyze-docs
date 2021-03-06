import React from 'react'
import { useCodeBlock } from './CodeBlock'

import RepositorySigningKey from './RepositorySigningKey'

type Props = {
  env?: { [key: string]: string }
}

const CollectorInstallInstructions: React.FunctionComponent<Props> = ({env}) => {
  const CodeBlock = useCodeBlock();
  let bashCmd: string;
  if (!env || Object.keys(env).length === 0) {
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
      <RepositorySigningKey />
      <p>
        Alternately, you can follow the <a href="https://pganalyze.com/docs/collector/packages">manual install instructions</a>.
      </p>
    </>
  )
}

export default CollectorInstallInstructions;