import React, { useState, useEffect, useRef, useCallback } from 'react';
import classNames from 'classnames';

import styles from '../style.module.scss'

export type TabProps = {
  id: string;
  label: string;
  textContent?: boolean;
  children: React.ReactNode;
}

export const Tab: React.FunctionComponent<TabProps> = ({ id, label, textContent, children }) => {
  return (
    <div data-tab-id={id} data-tab-label={label}>
      {textContent ? (
        <div className={styles.tabPanelTextContent}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}

type TabInfo = { id: string; label: string };

type Props = {
  children: React.ReactNode;
}

const TabPanel: React.FunctionComponent<Props> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tabs, setTabs] = useState<TabInfo[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const tabEls = containerRef.current.querySelectorAll('[data-tab-id]');
    const discovered: TabInfo[] = [];
    tabEls.forEach((el) => {
      discovered.push({
        id: el.getAttribute('data-tab-id')!,
        label: el.getAttribute('data-tab-label')!,
      });
    });
    if (discovered.length > 0) {
      setTabs(discovered);
      tabEls.forEach((el, idx) => {
        (el as HTMLElement).style.display = idx === 0 ? '' : 'none';
      });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || tabs.length === 0) return;
    const tabEls = containerRef.current.querySelectorAll('[data-tab-id]');
    tabEls.forEach((el, idx) => {
      (el as HTMLElement).style.display = idx === activeIdx ? '' : 'none';
    });
  }, [activeIdx, tabs]);

  const handleTabClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveIdx(parseInt(e.currentTarget.dataset.tabIdx!, 10));
  }, []);

  return (
    <>
      {tabs.length > 0 && (
        <ul className={classNames(styles.nav, styles.navTabs)}>
          {tabs.map((tab, idx) => (
            <li key={tab.id} className={styles.navItem}>
              <button
                type="button"
                data-tab-idx={idx}
                onClick={handleTabClick}
                className={classNames(styles.navLink, idx === activeIdx && styles.active)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div ref={containerRef}>
        {children}
      </div>
    </>
  );
}

export default TabPanel;
