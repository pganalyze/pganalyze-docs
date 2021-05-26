import React, { useState } from 'react';
import classNames from 'classnames';

import * as styles from '../style.module.scss'

export type TabItem = [ id: string, label: string ];

type Props = {
  items: TabItem[];
  children: (index: number) => React.ReactElement;
}

const TabPanel: React.FunctionComponent<Props> = ({items, children}) => {
  const [ activeIdx, setActiveIdx ] = useState(0)
  const activeTab = items[activeIdx];
  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const tabIdx = parseInt(e.currentTarget.dataset.tabIdx, 10)
    setActiveIdx(tabIdx)
  }
  return (
    <>
      <ul className={classNames(styles.nav, styles.navTabs)}>
        {items.map(([id, label], idx) => {
          return (
            <li key={id} className={styles.navItem}>
              <a href={`#${id}`} data-tab-idx={idx} onClick={handleTabClick} className={classNames(styles.navLink, idx === activeIdx && styles.active)}>
                {label}
              </a>
            </li>
          )
        })}
      </ul>
      <div className={styles.tabContent}>
        <div className={classNames(styles.tabPane, styles.active)} id={activeTab[0]}>
          {children(activeIdx)}
        </div>
      </div>
    </>
  )
}

export const TabTextContent: React.FunctionComponent = ({children}) => {
  return (
    <div className={styles.tabPanelTextContent}>{children}</div>
  )
}

export default TabPanel;