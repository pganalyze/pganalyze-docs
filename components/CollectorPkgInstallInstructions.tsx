import React, { useState } from 'react'

import TabPanel, { Tab } from './TabPanel'
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
          RPM based (RHEL, Amazon Linux, CentOS, Oracle Linux, Rocky Linux, Fedora)
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
  distro: 'el/10' | 'el/9' | 'el/8' | 'el/7' | 'fedora/43' | 'fedora/42'
}

type DebProps = {
  kind: 'deb'
  distro: "ubuntu/noble" | "ubuntu/jammy" | "ubuntu/focal" | "debian/bookworm" | "debian/bullseye"
}

type Props = YumProps | DebProps

type InstallOpt = [id: string, distro: YumProps['distro'] | DebProps['distro'], label: string];

function getInstallOpts(kind: string): InstallOpt[] {
  switch (kind) {
    case 'yum':
      return [
        [ 'el10', 'el/10', 'RHEL / Rocky / OL 10' ],
        [ 'el9', 'el/9', 'RHEL / Rocky / OL 9' ],
        [ 'el8', 'el/8', 'RHEL / Rocky / OL 8' ],
        [ 'al2023', 'el/9', 'Amazon Linux 2023' ],
        [ 'al2', 'el/7', 'Amazon Linux 2' ],
        [ 'fedora43', 'fedora/43', 'Fedora 43' ],
        [ 'fedora42', 'fedora/42', 'Fedora 42' ],
      ]
    case 'deb':
      return [
        ["noble", "ubuntu/noble", "Ubuntu 24.04"],
        ["jammy", "ubuntu/jammy", "Ubuntu 22.04"],
        ["focal", "ubuntu/focal", "Ubuntu 20.04"],
        ["bookworm", "debian/bookworm", "Debian 12"],
        ["bullseye", "debian/bullseye", "Debian 11"],
      ]
    default:
      return []
  }
}

const CollectorDistroInstallInstructions: React.FunctionComponent<Pick<Props, 'kind'>> = ({ kind }) => {
  const installOpts = getInstallOpts(kind);
  return (
    <>
      <TabPanel>
        {installOpts.map(([id, distro, label]) => (
          <Tab key={id} id={id} label={label}>
            <CollectorDistroPkgInstallInstructions kind={kind} distro={distro} />
          </Tab>
        ))}
      </TabPanel>
      <RepositorySigningKey />
    </>
  )
}

const CollectorDistroPkgInstallInstructions: React.FunctionComponent<{
  kind: string,
  distro: string
}> = ({ kind, distro }) => {
  let instructions = "";
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
      instructions = `curl -L https://packages.pganalyze.com/pganalyze_signing_key.asc -o /etc/apt/keyrings/pganalyze_signing_key.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/pganalyze_signing_key.asc] https://packages.pganalyze.com/${distro}/ stable main" | sudo tee /etc/apt/sources.list.d/pganalyze_collector.list
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
