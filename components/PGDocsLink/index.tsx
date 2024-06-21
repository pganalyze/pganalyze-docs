import React from "react";
import { useIcon } from "../WithIcons";

type Props = {
  path: string;
  version?: string;
  children: React.ReactNode;
};

const PGDocsLink = ({
  path,
  version,
  children,
}: Props) => {
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
