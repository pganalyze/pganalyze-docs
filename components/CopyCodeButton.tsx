import React from "react";
import { FontAwesomeIcon } from "./FontAwesomeIcon";
import { faCopy } from "@fortawesome/pro-light-svg-icons";

type CopyCodeButtonProps = { className?: string; title?: string };

// The copy button for docs code blocks. Renders a real <button> (so the
// `.copyIcon` styling applies) inside a <copy-code-button> custom element that
// wires click→clipboard on the client. The element is defined by
// copyCodeButton.client.ts, registered once per consumer (a <script> in
// DocsLayout on the web, a side-effect import in the app entrypoint), so the
// button works without hydrating this component — the web renders docs
// statically. This file does NOT import that module, so the definition is
// bundled only where it's registered, not everywhere CodeBlock is referenced.
const CopyCodeButton: React.FC<CopyCodeButtonProps> = ({ className, title }) =>
  React.createElement(
    "copy-code-button",
    null,
    <button type="button" className={className} title={title} aria-label="Copy">
      <FontAwesomeIcon icon={faCopy} title={title} />
    </button>,
  );

export default CopyCodeButton;
