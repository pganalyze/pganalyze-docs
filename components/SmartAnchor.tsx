import React from "react";
import { useIcon } from "./WithIcons";

import styles from './style.module.scss';

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

type LinkProps = Omit<AnchorProps, 'href'> & {
  // N.B. "to" can be a string, but also a location descriptor object (i.e., a destructured URL);
  // it's not worth copying the full type definition (especially since there may be differences between
  // the public site type and the in-app type)
  to: any
 };

type Props = (AnchorProps | LinkProps) & {
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

    const { children, ...otherProps } = props;
    return (
      <a {...otherProps} >{children}<ExternaLinkIcon className={styles.externalLinkIcon} /></a>
    )
  }

  const Link = linkComponent
  destination = adjustLinks && destination && !destination.startsWith('/') ? '../' + destination : destination;
  return <Link {...rest} to={destination} />
};

export function makeSmartAnchor(linkComponent: React.ComponentType<LinkProps>, linkRelative: boolean): React.ComponentType<Props> {
  return (props: Props) => <SmartAnchor {...props} linkComponent={linkComponent} linkRelative={linkRelative} />
}
