import React from "react";

import { FontAwesomeIcon as OrigFAIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

import classNames from "classnames";
import styles from './style.module.scss';

export const FontAwesomeIcon: React.FunctionComponent<FontAwesomeIconProps> = (props) => {
  const { className, ...rest } = props;
  return <OrigFAIcon className={classNames(styles.faIcon, className)} {...rest} />;
}
