import React from 'react';

import CodeBlock from "./CodeBlock";
import { useGeneratedPassword } from "./WithGeneratedPassword";

export const VerifyConnection: React.FunctionComponent<{host:string}> = ({host}) => {
  const password = useGeneratedPassword();
  return (
    <CodeBlock language="bash">{`PGPASSWORD=${password} psql -h ${host} -d mydatabase -U pganalyze`}</CodeBlock>
  )
}

export default VerifyConnection;
