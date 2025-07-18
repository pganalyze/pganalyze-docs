import React from 'react';

import { useCodeBlock } from "./CodeBlock";
import { useGeneratedPassword } from "./WithGeneratedPassword";

export const VerifyConnection: React.FunctionComponent<{host:string}> = ({host}) => {
  const CodeBlock = useCodeBlock();
  const password = useGeneratedPassword();
  return (
    <CodeBlock>{`PGPASSWORD=${password} psql -h {host} -d mydatabase -U pganalyze`}</CodeBlock>
  )
}

export default VerifyConnection;
