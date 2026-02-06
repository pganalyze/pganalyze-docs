import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faLightbulbOn,
  IconDefinition,
} from "@fortawesome/pro-solid-svg-icons";

type CalloutVariantType = "info" | "warning";
type CalloutButton = {
  label: string;
  onClick: () => void;
};

const Callout: React.FunctionComponent<{
  title?: string;
  children: React.ReactNode;
  variant?: CalloutVariantType;
  className?: string;
  learnMoreLink?: string;
  calloutButton?: CalloutButton;
}> = ({
  title,
  children,
  className,
  learnMoreLink,
  variant = "info",
  calloutButton,
}) => {
  const commonStyles = { fontWeight: "500", borderWidth: "1px", borderRadius: "0.25rem", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.75rem", paddingBottom: "0.75rem", marginBottom: "1.25rem" }
  let variantStyles: any;
  let iconStyles: any;
  let icon: IconDefinition;
  switch (variant) {
    case "info":
      variantStyles = { backgroundColor: "rgb(248 250 252)", borderColor: "rgb(226 232 240)", color: "rgb(51 65 85)" }
      iconStyles = { color: "#337ab7" }
      icon = faLightbulbOn;
      break;
    case "warning":
      variantStyles = { backgroundColor: "rgb(254 252 232)", borderColor: "rgb(234 179 8)", color: "rgb(161 98 7)" }
      iconStyles = { color: "rgb(202 138 4)" }
      icon = faExclamationTriangle;
      break;
  }
  const content = (
    <>
      {title && <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{title}</div>}
      {children}
    </>
  );
  return (
    <div style={{...commonStyles, ...variantStyles}} className={className}>
      <div style={{ display: "grid", gridTemplateColumns: "30px 1fr" }}>
        <div style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
          <FontAwesomeIcon style={iconStyles} icon={icon} />
        </div>
        <div style={{ paddingTop: "0.25rem", paddingBottom: "0.25rem" }}>
          {calloutButton ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", alignItems: "center", gap: "0.75rem" }}>
              <div>{content}</div>
              <button
                className="btn btn-success"
                onClick={calloutButton.onClick}
              >
                {calloutButton.label}
              </button>
            </div>
          ) : (
            <>{content}</>
          )}
          {learnMoreLink && (
            <div style={{ marginTop: "0.5rem" }}>
              <a target="_blank" rel="noopener" href={learnMoreLink}>
                Learn more in documentation
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Callout;
