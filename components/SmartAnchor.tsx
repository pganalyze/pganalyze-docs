import React from "react";

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

type LinkProps = Omit<AnchorProps, 'href'> & {
  // N.B. "to" can be a string, but also a location descriptor object (i.e., a destructured URL);
  // it's not worth copying the full type definition (especially since there may be differences between
  // the public site type and the in-app type)
  to: any
 };

type Props = (AnchorProps | LinkProps) & {
  linkComponent: React.ComponentType<LinkProps>
  linkRelative: boolean
}

const SmartAnchor: React.FunctionComponent<Props> = ({linkComponent, linkRelative, ...rest}) => {
  let destination: string;
  if ('to' in rest) {
    destination = rest.to;
    delete rest.to
  } else {
    destination = rest.href;
    delete rest.href
  }
  const isFragmentLink = destination?.startsWith('#')
  const isExternal = /^[a-zA-Z]+:/.test(destination)
  const isBareAnchor = isFragmentLink || isExternal

  if (isBareAnchor) {
    const props = {
      ...rest,
      href: destination,
    }

    if (isExternal) {
      const rel = []
      rel.push("noopener")
      const isPganalyze = /^https?:\/\/[a-zA-Z-]+\.pganalyze\.com/.test(destination)
      if (!isPganalyze) {
        rel.push("noreferrer")
      }
      props.rel = rel.join(' ')
    }

    return <a {...props} />
  }

  const Link = linkComponent
  destination = linkRelative ? '../' + destination : destination;
  return <Link {...rest} to={destination} />
};

export function makeSmartAnchor(linkComponent: React.ComponentType<LinkProps>, linkRelative: boolean): React.ComponentType<Props> {
  return (props: Props) => <SmartAnchor {...props} linkComponent={linkComponent} linkRelative={linkRelative} />
}
