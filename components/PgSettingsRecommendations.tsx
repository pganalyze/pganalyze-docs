import React, { useState } from 'react'

import styles from './style.module.scss';

type PGSettingRecommendation = {
  name: string;
  recommended: string;
  current?: string;
  recommendChange: boolean; // since some settings, like log_min_duration, may have a lower or upper recommended threshold
  required?: boolean;
  description?: string;
}

type RecommendationMode = 'list' | 'alter system';

type Props ={
  mode?: RecommendationMode,
  recommendations: PGSettingRecommendation[]
}

const PGSettingsRecommendations: React.FunctionComponent<Props> = ({ mode = 'list', recommendations }) => {
  const [ changes, setChanges ] = useState(() => {
    return recommendations.reduce((result, curr) => {
      result[curr.name] = curr.recommendChange
      return result
    }, {})
  })
  const hasCurrent = recommendations.some(s => s.current != null)
  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = e.currentTarget.dataset.setting;
    const doChange = e.currentTarget.checked
    setChanges(curr => ({ ...curr, [setting]: doChange }))
  }
  const recommendedChanges = recommendations.filter(s => changes[s.name]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Recommended</th>
            {hasCurrent && <th>Current</th>}
            <th>Change?</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map(s => {
            return (
              <tr key={s.name}>
                <td>{s.name}{s.description && <div className={styles.settingDescription}>{s.description}</div>}</td>
                <td>{s.recommended}</td>
                {hasCurrent && <td>{s.current ?? '<not set>'}</td>}
                <td>
                  <input data-setting={s.name} type="checkbox" checked={changes[s.name]} disabled={s.required} title={s.required && 'required'} onChange={handleToggleChange} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        <h3>Summary of recommended changes</h3>
        {mode === 'list'
        ? <ListRecommendations recommendations={recommendedChanges} />
        : mode === 'alter system'
        ? <AlterSystemRecommendations recommendations={recommendedChanges} />
        : null}
      </div>
    </div>
  )
}

const ListRecommendations: React.FunctionComponent<Pick<Props, 'recommendations'>> = ({recommendations}) => {
  return (
    <dl className={styles.recommendationsList}>
      {recommendations.map(s => {
        return (
          <React.Fragment key={s.name}>
            <dt>
              {s.name}
            </dt>
            <dd key={s.name}>
              {s.recommended}
            </dd>
          </React.Fragment>
        )
      })}
    </dl>
  )
}

const AlterSystemRecommendations: React.FunctionComponent<Pick<Props, 'recommendations'>> = ({recommendations}) => {
  return (
    <div className={styles.recommendationsAlterSystem}>
      {recommendations.map(s => {
        // List-style settings like shared_preload_libraries must be passed to ALTER SYSTEM unquoted,
        // or Postgres will treat the whole list as a single library, which of course normally does
        // not exist and the server will fail to boot, and you'll need to edit the ALTER SYSTEM file
        // that says "do not edit" or use even more convoluted workarounds to get things running again.
        const value = s.name === 'shared_preload_libraries' ? s.recommended : `'${s.recommended}'`
        return (
          <span key={s.name}>ALTER SYSTEM SET {s.name} TO {value};</span>
        )
      })}
    </div>
  )
}

type CurrentSettings = {
  [name: string]: string
}

export const getAutoExplainRecommendations = (settings: CurrentSettings | undefined): PGSettingRecommendation[] => {
  const defaultRecommened: PGSettingRecommendation[] = [
    {
      name: 'shared_preload_libraries',
      recommended: 'pg_stat_statements, auto_explain, any others currently configured',
      recommendChange: true,
      required: true,
      description: "Specifies one or more shared libraries to be preloaded at server start. It contains a comma-separated list of library names and must include auto_explain."
    },
    {
      name: 'auto_explain.log_format',
      recommended: 'json',
      recommendChange: true,
      required: true,
      description: "Selects the EXPLAIN output format to be used. Only json is supported by pganalyze, with partial support for text."
    },
    {
      name: 'auto_explain.log_min_duration',
      recommended: '1000',
      recommendChange: true,
      required: true,
      description: "Minimum statement execution time, in milliseconds, that will cause the statement's plan to be logged. Setting this to 0 logs all plans; -1 disables logging of plans. For example, if you set it to 250ms then all statements that run 250ms or longer will be logged."
    },
    {
      name: 'auto_explain.log_analyze',
      recommended: 'on',
      recommendChange: true,
      description: "Causes EXPLAIN ANALYZE output, rather than just EXPLAIN output, to be printed when an execution plan is logged."
    },
    {
      name: 'auto_explain.log_buffers',
      recommended: 'on',
      recommendChange: true,
      description: "Controls whether buffer usage statistics are printed when an execution plan is logged; it's equivalent to the BUFFERS option of EXPLAIN. This parameter has no effect unless auto_explain.log_analyze is enabled."
    },
    {
      name: 'auto_explain.log_timing',
      recommended: 'off',
      recommendChange: true,
      description: "Controls whether per-node timing information is printed when an execution plan is logged; it's equivalent to the TIMING option of EXPLAIN. The overhead of repeatedly reading the system clock can slow down queries significantly. This parameter has no effect unless auto_explain.log_analyze is enabled."
    },
    {
      name: 'auto_explain.log_triggers',
      recommended: 'on',
      recommendChange: true,
      description: "Causes trigger execution statistics to be included when an execution plan is logged. This parameter has no effect unless auto_explain.log_analyze is enabled."
    },
    {
      name: 'auto_explain.log_verbose',
      recommended: 'on',
      recommendChange: true,
      description: "Controls whether verbose details are printed when an execution plan is logged; it's equivalent to the VERBOSE option of EXPLAIN."
    },
    {
      name: 'auto_explain.log_nested_statements',
      recommended: 'on',
      recommendChange: true,
      description: "Causes nested statements (statements executed inside a function) to be considered for logging. When it is off, only top-level query plans are logged."
    },
    {
      name: 'auto_explain.sample_rate',
      recommended: '1',
      recommendChange: true,
      description: "Causes auto_explain to only explain a fraction of the statements in each session. In case of nested statements, either all will be explained or none. "
    },
  ];
  return defaultRecommened.map(r => {
    const current = settings?.[r.name]
    if (current == null) {
      return r;
    }
    if (r.name === 'shared_preload_libraries') {
      const newPgss = current.split(/\s*,\s*/)
      const recommendChange = !newPgss.includes('auto_explain')
      if (recommendChange) {
        newPgss.concat('auto_explain')
      }
      return {
        ...r,
        current,
        recommended: recommendChange ? newPgss.join(',') : current,
        recommendChange,
      } 
    } else if (r.name === 'log_min_duration') {
      const currLogMinDuration = parseInt(current, 10)
      const recommenedLogMinDuration = parseInt(r.recommended, 10)
      // N.B.: including -1 for disabled--this must be enabled for auto_explain to be useful
      const recommendChange = currLogMinDuration < recommenedLogMinDuration;
      return {
        ...r,
        current,
        recommendChange,
      }
    } else {
      const recommendChange = r.recommended != current
      return {
        ...r,
        current,
        recommendChange
      }
    }
  })
}

export default PGSettingsRecommendations;
