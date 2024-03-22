import React from "react";
import { Link } from "react-router-dom";

import styles from "../style.module.scss";

export type InstallChoiceItem = [
  link: string,
  img: string,
  providerName: string,
  text: string,
];

type Props = {
  docsRoot: boolean;
  items: InstallChoiceItem[];
};

const InstallChoice: React.FunctionComponent<Props> = ({ docsRoot, items }) => {
  return (
    <>
      <div className={styles.overviewInstallChoice}>
        {items.map((item) => {
          const linkTo = `${docsRoot && "/docs/"}${item.link}`;
          const imgAlt = `Logo of ${item.providerName}`;
          return (
            <Link className={styles.overviewInstallChoiceStep} to={linkTo}>
              <div className={styles.overviewInstallChoiceProvider}>
                <img src={item.img} alt={imgAlt} />
                {item.providerName}
              </div>
              <div>{item.text}</div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default InstallChoice;
