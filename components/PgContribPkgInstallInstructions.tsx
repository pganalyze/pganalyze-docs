import React from 'react'
import classNames from 'classnames'

import styles from '../style.module.scss'

const PgContribPkgInstallInstructions: React.FunctionComponent = () => {
  const versions: string[] = [ '11', '10', '9.6', '9.5', '9.4' ];
  return (
  <>
    <ul className={classNames(styles.nav, styles.navTabs)}>
      {versions.map((version, idx) => {
        const id = `pg${version.replace(/\D/, '')}`
        const label = `Postgres ${version}`
        return (
          <a key={id} href={`#${id}`} data-toggle="tab" className={classNames(styles.navLink, idx === 0 && styles.active)}>
          {label}
        </a>
        )
      })}
    </ul>
    <div className={styles.tabContent}>
      {versions.map((version, idx) => {
        const id = `pg${version.replace(/\D/, '')}`
        return (
          <div key={id} id={id} className={classNames(styles.tabPane, idx === 0 && styles.active)}>
            <pre>
              <code>sudo apt-get install postgresql-contrib-{version}</code>
            </pre>
          </div>
        )
      })}
    </div>
  </>
  )
}

export default PgContribPkgInstallInstructions;
