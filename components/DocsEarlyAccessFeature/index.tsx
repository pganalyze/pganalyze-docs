import React from "react";

import styles from "./style.module.scss";

const DocsEarlyAccessFeature: React.FunctionComponent<{
  feature: string;
}> = ({ feature }) => {
  return (
    <div className={styles.container}>
      <h3>{feature} is in Early Access</h3>
      <p>
        This feature is available to a limited number of customers in early access and may change without notice. <a href={`mailto:team@pganalyze.com?subject=${feature} early access`}>Reach out to us</a> if you're interested.
      </p>
    </div>
  );
}

export default DocsEarlyAccessFeature;
