import React from 'react'
import classNames from 'classnames'

type YumProps = {
  kind: 'yum'
  distro: 'el/8' | 'el/7' | 'el/6' | 'fedora/30' | 'fedora/29'
}

type DebProps = {
  kind: 'deb'
  distro: "ubuntu/bionic" | "ubuntu/xenial" | "ubuntu/trusty" | "debian/buster" | "debian/stretch" | "debian/jessie"
}

type Props = YumProps | DebProps

const CollectorPkgInstallInstructions: React.FunctionComponent<Props> = ({ kind }) => {
  type InstallOpt = [id: string, distro: YumProps['distro'] | DebProps['distro'], label: string];
  let installOpts: InstallOpt[] = [];
  switch (kind) {
    case 'yum':
      installOpts = [
        [ 'el8', 'el/8', 'RHEL 8' ],
        [ 'el7', 'el/7', 'RHEL 7 / Amazon Linux 2' ],
        [ 'el6', 'el/6', 'RHEL 6 / Amazon Linux' ],
        [ 'fedora30', 'fedora/30', 'Fedora 30' ],
        [ 'fedora29', 'fedora/29', 'Fedora 29' ],
      ]
      break
    case 'deb':
      installOpts = [
        ["bionic", "ubuntu/bionic", "Ubuntu 18.04"],
        ["xenial", "ubuntu/xenial", "Ubuntu 16.04"],
        ["trusty", "ubuntu/trusty", "Ubuntu 14.04"],
        ["buster", "debian/buster", "Debian 10"],
        ["stretch","debian/stretch",  "Debian 9"],
        ["jessie", "debian/jessie", "Debian 8"],
      ]
      break
  }

  return (
    <>
      <ul className="nav nav-tabs">
        {installOpts.map(([id, _distro, label], idx) => {
          return (
            <li className="nav-item">
              <a href={`#${id}`} data-toggle="tab" className={classNames('nav-link', idx === 0 && 'active')}>
                {label}
              </a>
            </li>
          )
        })}
      </ul>
      <div className="tab-content">
        {installOpts.map(([id, distro, _label], idx) => {
          return (
            <div className={classNames("tab-pane", idx === 0 && 'active')} id={id}>
              <CollectorDistroPkgInstallInstructions kind={kind} distro={distro} />
            </div>
          )
        })}        
      </div>
    </>
  )
}

const CollectorDistroPkgInstallInstructions: React.FunctionComponent<{
  kind: string,
  distro: string
}> = ({ kind, distro }) => {
  let instructions: string;
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
    <pre style={{ maxWidth: "100%" }}>
      <code>
        {instructions}
      </code>
    </pre>
  )
}

export default CollectorPkgInstallInstructions;
