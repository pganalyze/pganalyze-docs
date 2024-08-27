import React, { useContext } from "react";
import { useIcon } from "./WithIcons";

import classNames from "classnames";

import styles from './style.module.scss';

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
  const ExternaLinkIcon = useIcon('externalLink')
  let destination: string;
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

    if (isAbsolute) {
      const rel = []
      rel.push("noopener")
      const isPganalyzeWebLink = /^https?:\/\/pganalyze\.com/.test(destination)
      if (!isPganalyzeWebLink) {
        rel.push("noreferrer")
      }
      props.rel = rel.join(' ')
    }

    const { children, className, target, ...otherProps } = props;
    // Don't show external icon link in some situations
    const skipExternalLinkIcon = destination.startsWith('https://dashboard.heroku.com/new-app')
      || destination.startsWith('#')
      || destination.startsWith('mailto:')
    return (
      <a
        {...otherProps}
        className={classNames(styles.noWrap, className)}
        target={
          target ?? (isAbsolute && !skipExternalLinkIcon) ? "_blank" : "_self"
        }
      >
        {children}{!skipExternalLinkIcon && <ExternaLinkIcon className={styles.externalLinkIcon} />}
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
