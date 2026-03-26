import React from 'react';

import styles from '../style.module.scss'

export type TabProps = {
  id: string;
  label: string;
  textContent?: boolean;
  children: React.ReactNode;
}

export const Tab: React.FunctionComponent<TabProps> = ({ id, label, textContent, children }) => {
  return (
    <div data-tab-id={id} data-tab-label={label} style={{ display: 'none' }}>
      {textContent ? (
        <div className={styles.tabPanelTextContent}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
}

type Props = {
  children: React.ReactNode;
}

// Inline script that discovers tabs from data attributes, builds the tab
// navigation, and handles switching.  Runs in the browser without needing
// React hydration, so TabPanel works both as an Astro island and as a
// static SSR component.
const tabScript = `
(function(){
  var container = document.currentScript.parentElement;
  var tabs = container.querySelectorAll('[data-tab-id]');
  if (!tabs.length) return;

  // Show the first tab
  tabs[0].style.display = '';

  // Build the nav
  var ul = document.createElement('ul');
  ul.className = '${styles.nav} ${styles.navTabs}';
  var buttons = [];
  tabs.forEach(function(tab, idx) {
    var li = document.createElement('li');
    li.className = '${styles.navItem}';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = tab.getAttribute('data-tab-label');
    btn.className = '${styles.navLink}' + (idx === 0 ? ' ${styles.active}' : '');
    btn.addEventListener('click', function() {
      tabs.forEach(function(t, i) {
        t.style.display = i === idx ? '' : 'none';
      });
      buttons.forEach(function(b, i) {
        b.className = '${styles.navLink}' + (i === idx ? ' ${styles.active}' : '');
      });
    });
    buttons.push(btn);
    li.appendChild(btn);
    ul.appendChild(li);
  });

  container.insertBefore(ul, container.firstChild);
  document.currentScript.remove();
})();
`;

const TabPanel: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <div>
      {children}
      <script dangerouslySetInnerHTML={{ __html: tabScript }} />
    </div>
  );
}

export default TabPanel;
