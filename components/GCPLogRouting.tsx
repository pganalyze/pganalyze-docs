import React from 'react'

import TabPanel, { Tab } from './TabPanel'

const GCPLogRouting: React.FunctionComponent<{imgCreateLogSink: string}> = ({ imgCreateLogSink }) => {
  return (
    <TabPanel>
      <Tab id="cloudsql" label="Google Cloud SQL" textContent>
        <p>
          Navigate to your Cloud SQL instance, click on "View PostgreSQL error logs", and then click on "Logs Router".
        </p>
        <p>
          Click "Create Sink", and select your Pub/Sub topic. Make sure that the left side is actually
          showing PostgreSQL logs (as it does in this screenshot), and that you don't have a different
          type of resource selected:
        </p>
        <p>
          <img src={imgCreateLogSink} alt="Screenshot of creating a log sink in Google Cloud Console" />
        </p>
      </Tab>
      <Tab id="alloydb" label="Google AlloyDB" textContent>
        <p>
          Navigate to the Logs Router screen under the Logging service. Click "Create Sink" and select your Pub/Sub topic as the destination.
        </p>
        <p>
          To filter for AlloyDB log events, specify an inclusion filter
          in the following format, replacing <code>MYCLUSTER</code> with your cluster name:
        </p>
        <pre>
          {`resource.type="alloydb.googleapis.com/Instance"
resource.labels.cluster_id="MYCLUSTER"`}
        </pre>
      </Tab>
    </TabPanel>
  )
}

export default GCPLogRouting;
