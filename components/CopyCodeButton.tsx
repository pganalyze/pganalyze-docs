import React from "react";
import { FontAwesomeIcon } from "./FontAwesomeIcon";
import { faCopy } from "@fortawesome/pro-light-svg-icons";
import type { CopyButtonProps } from "./WithCopyButton";

// Default copy button on the public docs site. Renders a real <button> (so the
// existing `.copyIcon` styling applies) inside a <copy-code-button> custom
// element that wires click→clipboard on the client without React hydration —
// the docs pages are rendered statically by Astro, so the copy button can't rely
// on hydration. The element is defined by copyCodeButton.client.ts, loaded once
// in DocsLayout. This file does NOT import that module so the in-app build —
// which injects its own copy button — doesn't bundle the element definition.
const CopyCodeButton: React.FC<CopyButtonProps> = ({ className, title }) =>
  React.createElement(
    "copy-code-button",
    null,
    <button type="button" className={className} title={title} aria-label="Copy">
      <FontAwesomeIcon icon={faCopy} title={title} />
    </button>,
  );

export default CopyCodeButton;
