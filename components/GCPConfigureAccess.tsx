import React from 'react'

import TabPanel, { TabItem } from './TabPanel'

import styles from './style.module.scss'

const GCPConfigureAccess: React.FunctionComponent = () => {
  const tabs: TabItem[] = [
    [ 'assign_vm', 'Assign Service Account to VM (Recommended)' ],
    [ 'cred_file', 'Use credentials file' ],
  ];
  return (
    <TabPanel items={tabs}>
      {(idx: number) => {
        const id = tabs[idx]?.[0];
        switch (id) {
          case 'assign_vm':
            return <AssignVMInstructions />
          case 'cred_file':
            return <CredFileInstructions />
          default:
            return null;
        }
      }}
    </TabPanel>
  )
}

const AssignVMInstructions: React.FunctionComponent = () => {
  return (
    <div className={styles.tabPanelTextContent}>
      <p>
        To keep things simple and secure, we recommend assigning the service account to the VM. To do so, navigate to your virtual machine.
      </p>
      <p>
        If your virtual machine is running, you will need to stop it to change the associated service
        account. Then, edit the VM instance details, and set the "Service account" setting to the just-created
        service account. Now, start the VM again.
      </p>
      <p>
        Local processes on the VM, such as the pganalyze collector, can now access APIs through the service account.
      </p>
    </div>
  )
}

const CredFileInstructions: React.FunctionComponent = () => {
  return (
    <div className={styles.tabPanelTextContent}>
      <p>
        If you cannot assign the service account to your VM, you can specify credentials directly:
      </p>
      <ul>
        <li>Associate a key to the service account</li>
        <li>Download the private key in JSON format and save on the collector VM</li>
        <li>Specify the path to the key file as the value for the <code>gcp_credentials_file</code> collector setting</li>
      </ul>
    </div>
  )
}

export default GCPConfigureAccess;