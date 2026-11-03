import React from "react";

import CodeBlock from "./CodeBlock";
import { useGeneratedPassword } from "./WithGeneratedPassword";

export const CNPGMonitoringSecretYaml: React.FunctionComponent = () => {
  const password = useGeneratedPassword();
  return (
    <CodeBlock language="yaml">
      {`apiVersion: v1
kind: Secret
metadata:
  name: pganalyze-monitoring-user
  namespace: default # use the same namespace as your Cluster
type: kubernetes.io/basic-auth
stringData:
  username: pganalyze
  password: ${password}`}
    </CodeBlock>
  );
};

export const CNPGMonitoringSecretKubectl: React.FunctionComponent = () => {
  const password = useGeneratedPassword();
  return (
    <CodeBlock language="bash">
      {`kubectl create secret generic pganalyze-monitoring-user \\
  --namespace default \\
  --type kubernetes.io/basic-auth \\
  --from-literal=username=pganalyze \\
  --from-literal=password=${password}`}
    </CodeBlock>
  );
};
