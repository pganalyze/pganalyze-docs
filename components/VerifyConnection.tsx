import React from 'react';

import CodeBlock from "./CodeBlock";
import { useGeneratedPassword } from "./WithGeneratedPassword";

export const VerifyConnection: React.FunctionComponent<{host: string, dbname?: string}> = ({host, dbname = 'mydatabase'}) => {
  const password = useGeneratedPassword();
  return (
    <CodeBlock language="bash">{`PGPASSWORD=${password} psql -h ${host} -d ${dbname} -U pganalyze`}</CodeBlock>
  )
}

export default VerifyConnection;
