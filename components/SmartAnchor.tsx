import React, { useContext } from "react";
import { FontAwesomeIcon } from "./FontAwesomeIcon";
import { faExternalLink } from "@fortawesome/pro-regular-svg-icons";

import classNames from "classnames";

import styles from './style.module.scss';

// A link is "internal" (no external-link icon, opens in the same tab) when it
// targets our own site: the canonical pganalyze.com domain, or the host the
// page is currently served from — which covers local dev, staging, and review
// apps. Everything else is treated as external.
function isInternalUrl(url: string): boolean {
  try {
    const { host } = new URL(url, "https://pganalyze.com/");
    if (host === "pganalyze.com" || host === "www.pganalyze.com") return true;
    if (typeof window !== "undefined" && host === window.location.host) return true;
    return false;
  } catch {
    return true;
  }
}

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

type LinkProps = Omit<AnchorProps, 'href'> & {
  // N.B. "to" can be a string, but also a location descriptor object (i.e., a destructured URL);
  // it's not worth copying the full type definition (especially since there may be differences between
  // the public site type and the in-app type)
  to: any
};

type BaseProps = (AnchorProps | LinkProps);

type Props = BaseProps & {
  // Accepting the linkComponent as a prop allows us to render under different routers
  linkComponent: React.ComponentType<LinkProps>
  // In some situations, relative links can be evaluated as siblings of the current route, and
  // some as children. To standardize this, we can adjust the route in this component by accepting a flag.
  linkRelative: boolean
}

const SmartAnchor: React.FunctionComponent<Props> = ({linkComponent, linkRelative: adjustLinks, ...rest}) => {
  let destination: string | undefined;
  if ('to' in rest) {
    destination = rest.to;
    delete rest.to
  } else {
    destination = rest.href;
    delete rest.href
  }
  if (destination == null) {
    // If we have no destination, just return children not linked to anything
    return <span className={rest.className}>{rest.children}</span>;
  }

  const isFragmentLink = destination?.startsWith('#')
  const isAbsolute = /^[a-zA-Z]+:/.test(destination)
  const isBareAnchor = isFragmentLink || isAbsolute

  if (isBareAnchor) {
    const props = {
      ...rest,
      href: destination,
    }

    const internal = isInternalUrl(destination);

    const { children, className, target, ...otherProps } = props;
    // Show the external-link icon only for links that leave our own site.
    // Internal links (relative, pganalyze.com, or the current host) get no icon;
    // also keep skipping it for in-page anchors, mail links, and the Heroku
    // deploy button (a styled button, not inline text).
    const skipExternalLinkIcon = internal
      || isFragmentLink
      || destination.startsWith('mailto:')
      || destination.startsWith('https://dashboard.heroku.com/new-app')
    return (
      <a
        {...otherProps}
        className={classNames(styles.noWrap, className)}
        target={
          target ?? (isAbsolute && !skipExternalLinkIcon) ? "_blank" : "_self"
        }
      >
        {children}{!skipExternalLinkIcon && <FontAwesomeIcon icon={faExternalLink} className={styles.externalLinkIcon} />}
      </a>
    )
  }

  const Link = linkComponent
  destination = adjustLinks && destination && !destination.startsWith('/') ? '../' + destination : destination;
  return <Link {...rest} to={destination} />
};

const SmartAnchorContext = React.createContext<React.ComponentType<BaseProps> | undefined>(undefined);

export const WithSmartAnchor = ({linkComponent, linkRelative, children}: {
  linkComponent: React.ComponentType<LinkProps>;
  linkRelative: boolean;
  children: React.ReactNode;
}) => {
  return (
    <SmartAnchorContext.Provider value={makeSmartAnchor(linkComponent, linkRelative)}>
      {children}
    </SmartAnchorContext.Provider>
  )
}

export function useSmartAnchor(): React.ComponentType<BaseProps> {
  const value = useContext(SmartAnchorContext);
  if (!value) {
    throw new Error('must be used within WithSmartAnchor');
  }
  return value;
}

export function makeSmartAnchor(linkComponent: React.ComponentType<LinkProps>, linkRelative: boolean): React.ComponentType<BaseProps> {
  return (props: BaseProps) => <SmartAnchor {...props} linkComponent={linkComponent} linkRelative={linkRelative} />
}
