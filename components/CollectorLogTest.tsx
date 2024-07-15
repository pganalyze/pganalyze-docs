import React from 'react'
import { useCodeBlock } from './CodeBlock'

const CollectorLogTest: React.FunctionComponent<{provider: string, configFromEnv?: boolean}> = ({provider, configFromEnv}) => {
  const CodeBlock = useCodeBlock();

  const sampleOutput = `...
I [server1] Testing log collection (${provider})...
I [server1]   Log test successful
I Successfully reloaded pganalyze collector (PID 123)`

  if (configFromEnv == null) {
    return (
      <>
        <p>
          When the collector is installed in a virtual machine, you can now test
          and apply the collector configuration (for container environments, simply
          restart the collector):
        </p>
        <CodeBlock>sudo pganalyze-collector --test</CodeBlock>
        <CodeBlock>{sampleOutput}</CodeBlock>
      </>
    )
  } else if (configFromEnv) {
    return (
      <p>
        To apply the configuration, restart the container for the pganalyze
        collector. You can confirm whether the configuration is correct by
        watching for a "Submitted compact snapshots successfully" message
        in the container log output.
      </p>
    )
  } else if (!configFromEnv) {
    return (
      <>
        <p>You can now test and apply the collector configuration:</p>
        <CodeBlock>sudo pganalyze-collector --test</CodeBlock>
        <CodeBlock>{sampleOutput}</CodeBlock>
        <p>
          If you are getting an error, it sometimes helps to run the
          test with the `-v` flag to show all details:
        </p>
        <CodeBlock>sudo pganalyze-collector --test -v</CodeBlock>
      </>
    )
  } else {
    return null;
  }
}

export default CollectorLogTest;
