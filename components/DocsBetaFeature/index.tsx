import React from "react";

import styles from "./style.module.scss";

const DocsBetaFeature: React.FunctionComponent<{
  feature: string;
}> = ({ feature }) => {
  return (
    <div className={styles.container}>
      <h3>{feature} is in Beta</h3>
      <p>
        This functionality may still change without notice. <a href={`mailto:support@pganalyze.com?subject=${feature} feedback`}>Let us know your feedback!</a>
      </p>
    </div>
  );
}

export default DocsBetaFeature;
