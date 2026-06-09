import React from "react";
import { FontAwesomeIcon } from "../FontAwesomeIcon";
import { faExternalLink } from "@fortawesome/pro-regular-svg-icons";

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
  return (
    <a
      target="_blank"
      href={`https://www.postgresql.org/docs/${version ?? "current"}${path}`}
    >
      {children} <FontAwesomeIcon icon={faExternalLink} />
    </a>
  );
};

export default PGDocsLink;
