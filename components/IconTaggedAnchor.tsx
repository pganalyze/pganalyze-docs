import React from "react";

const IconTaggedAnchor: React.FunctionComponent<React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>> = (props) => {
  if (props.href?.startsWith("https://github.com")) {
    return (
      <>
        <i className="fa fa-github"></i>&nbsp;
        <a {...props} />
      </>
    );
  }

  return <a {...props} />;
};

export default IconTaggedAnchor;
