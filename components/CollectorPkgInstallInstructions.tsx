import React, { useState } from 'react'

import TabPanel, { TabItem } from './TabPanel'
import { useCodeBlock } from './CodeBlock'
import RepositorySigningKey from './RepositorySigningKey'

const CollectorPkgInstallInstructions = () => {
  const [ pkgKind, setPkgKind ] = useState('yum')
  const handleDistroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPkgKind(e.currentTarget.value)
  }
  return (
    <>
      <p>
        Choose which OS distribution you are running:
      </p>
      <div style={{paddingLeft: '16px', paddingBottom: '8px'}}>
        <label style={{display: 'block', fontWeight: 'normal'}}>
          <input style={{marginRight: '4px'}} type='radio' name='distro' value='yum' onChange={handleDistroChange} checked={pkgKind === 'yum'} />
          RPM based (RHEL, Amazon Linux, Fedora, CentOS)
        </label>
        <label style={{display: 'block', fontWeight: 'normal'}}>
          <input style={{marginRight: '4px'}} type='radio' name='distro' value='deb' onChange={handleDistroChange} checked={pkgKind === 'deb'} />
          Debian based (Debian, Ubuntu)
        </label>
      </div>
      <p>
        SSH into your system and run the following to download and install the package:
      </p>
      {pkgKind === 'deb' ? (
        <CollectorDistroInstallInstructions kind='deb' />
      ) : pkgKind === 'yum' ? (
        <CollectorDistroInstallInstructions kind='yum' />
      ) : null}
    </>
  )
}

type YumProps = {
  kind: 'yum'
  distro: 'el/8' | 'el/7' | 'fedora/30' | 'fedora/29'
}

type DebProps = {
  kind: 'deb'
  distro: "ubuntu/focal" | "ubuntu/bionic" | "ubuntu/xenial" | "debian/buster" | "debian/stretch"
}

type Props = YumProps | DebProps

const CollectorDistroInstallInstructions: React.FunctionComponent<Pick<Props, 'kind'>> = ({ kind }) => {
  type InstallOpt = [id: string, distro: YumProps['distro'] | DebProps['distro'], label: string];
  let installOpts: InstallOpt[] = [];
  switch (kind) {
    case 'yum':
      installOpts = [
        [ 'el8', 'el/8', 'RHEL 8' ],
        [ 'el7', 'el/7', 'RHEL 7 / Amazon Linux 2' ],
        [ 'fedora30', 'fedora/30', 'Fedora 30' ],
        [ 'fedora29', 'fedora/29', 'Fedora 29' ],
      ]
      break
    case 'deb':
      installOpts = [
        ["focal", "ubuntu/focal", "Ubuntu 20.04"],
        ["bionic", "ubuntu/bionic", "Ubuntu 18.04"],
        ["xenial", "ubuntu/xenial", "Ubuntu 16.04"],
        ["buster", "debian/buster", "Debian 10"],
        ["stretch","debian/stretch",  "Debian 9"],
      ]
      break
  }
  const tabs = installOpts.map<TabItem>(opt => [opt[0], opt[2]])
  return (
    <>
      <TabPanel items={tabs}>
        {(idx: number) => {
          const distro = installOpts[idx][1];
          return <CollectorDistroPkgInstallInstructions kind={kind} distro={distro} />
        }}
      </TabPanel>
      <RepositorySigningKey />
    </>
  )
}

const CollectorDistroPkgInstallInstructions: React.FunctionComponent<{
  kind: string,
  distro: string
}> = ({ kind, distro }) => {
  let instructions: string;
  const CodeBlock = useCodeBlock();
  switch (kind) {
    case 'yum':
      instructions = `echo "[pganalyze_collector]
name=pganalyze_collector
baseurl=https://packages.pganalyze.com/${distro}
repo_gpgcheck=1
enabled=1
gpgkey=https://packages.pganalyze.com/pganalyze_signing_key.asc
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300" | sudo tee -a /etc/yum.repos.d/pganalyze_collector.repo\n
sudo yum makecache
sudo yum install pganalyze-collector`
      break
    case 'deb':
      instructions = `curl -L https://packages.pganalyze.com/pganalyze_signing_key.asc | sudo apt-key add -
echo "deb [arch=amd64] https://packages.pganalyze.com/${distro}/ stable main" | sudo tee /etc/apt/sources.list.d/pganalyze_collector.list
sudo apt-get update
sudo apt-get install pganalyze-collector`
      break
  }

  return (
    <CodeBlock style={{ maxWidth: "100%" }}>
      {instructions}
    </CodeBlock>
  )
}

export default CollectorPkgInstallInstructions;
