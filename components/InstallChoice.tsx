import React from "react";
import { Link } from "gatsby";

import styles from "../style.module.scss";

type InstallChoiceItem = {
  link: string;
  img: string;
  providerName: string;
  text: string;
};

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
            <Link className={styles.overviewInstallChoiceStep} to={linkTo} key={item.providerName}>
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
