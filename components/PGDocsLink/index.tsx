import React from "react";
import { useIcon } from "../WithIcons";

type Props = {
  path: string;
  version?: string;
};

const PGDocsLink: React.FunctionComponent<Props> = ({
  path,
  version,
  children,
}) => {
  const ExternaLinkIcon = useIcon('externalLink')
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://www.postgresql.org/docs/${version ?? "current"}${path}`}
    >
      {children} <ExternaLinkIcon />
    </a>
  );
};

export default PGDocsLink;
