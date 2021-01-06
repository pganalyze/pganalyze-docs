import React from "react";

type AnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

type LinkProps = Omit<AnchorProps, 'href'> & {
  to: string
};

type Props = (AnchorProps | LinkProps) & {
  linkComponent: React.ComponentType<LinkProps>
  linkRelative: boolean
}

const SmartAnchor: React.FunctionComponent<Props> = ({linkComponent, linkRelative, ...rest}) => {
  let target: string;
  if ('to' in rest) {
    target = rest.to;
    delete rest.to
  } else {
    target = rest.href;
    delete rest.href
  }
  const isExternal = /^[a-zA-Z]+:/.test(target)

  if (isExternal) {
    const rel = [ "noopener" ]
    const isPganalyze = /^https?:\/\/[a-zA-Z-]+\.pganalyze\.com/.test(target)

    if (!isPganalyze) {
      rel.push("noreferrer")
    }
    return <a {...rest} href={target} target="_blank" rel={rel.join(' ')} />
  }

  const Link = linkComponent
  target = linkRelative ? '../' + target : target;
  return <Link {...rest} to={target} />
};

export function makeSmartAnchor(linkComponent: React.ComponentType<LinkProps>, linkRelative: boolean): React.ComponentType<Props> {
  return (props: Props) => <SmartAnchor {...props} linkComponent={linkComponent} linkRelative={linkRelative} />
}
