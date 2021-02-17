import React from 'react'
import CodeBlock from './CodeBlock';
import Null from './Null';

import styles from './style.module.scss';
import { useExtraInfo } from './WithExtraInfo';
import { useIcon } from './WithIcons';

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
  const hasCurrent = recommendations.some(s => s.current != null);
  const Description = useExtraInfo()

  return (
    <>
      <table className={styles.settingsTable}>
        <thead>
          <tr>
            <th>Setting</th>
            {hasCurrent && <th>Current</th>}
            <th>Recommended</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map(r => {
            return (
              <tr key={r.name}>
                <td className={styles.noWrap}>{r.name}<Description className={styles.settingDescription} info={r.description} /></td>
                {hasCurrent && <td>{r.current ?? '[not set]'}</td>}
                <td>{r.recommended}</td>
                <td>
                  <RecommendationStatus recommendation={r} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <RecommendationSummary mode={mode} recommendations={recommendations} />
    </>
  )
}

const RecommendationSummary: React.FunctionComponent<Props> = ({mode, recommendations}) => {
  const requiredChanges = recommendations.filter(r => r.recommendChange && r.required);
  const recommendedChanges = recommendations.filter(r => r.recommendChange && !r.required);

  const hasRequired = requiredChanges.length > 0;
  const hasRecommended = recommendedChanges.length > 0
  if (!hasRequired && !hasRecommended) {
    return <div>No changes are required or recommended</div>
  }

  const Recommendations: React.ComponentType<Pick<Props, 'recommendations'>> = mode === 'list'
    ? ListRecommendations
    : mode === 'alter system'
    ? AlterSystemRecommendations
    : Null

  return (
    <div>
      {hasRequired && (
        <>
          <h3>Summary of required changes</h3>
          <Recommendations recommendations={requiredChanges} />
        </>
      )}
      {hasRecommended && (
        <>
          <h3>Summary of recommended changes</h3>
          <Recommendations recommendations={recommendedChanges} />
        </>
      )}
    </div>
  )
}

const RecommendationStatus: React.FunctionComponent<{recommendation: PGSettingRecommendation}> = ({recommendation}) => {
  const OkayIcon = useIcon('okay');
  const ChangeRequiredIcon = useIcon('changeRequired');
  const InfoIcon = useIcon('info');

  if (!recommendation.recommendChange) {
    return (
      <div title="no changes required">
        <OkayIcon />
      </div>
    )
  } else if (recommendation.required) {
    return (
      <div title="update required">
        <ChangeRequiredIcon />
      </div>
    )
  } else {
    return (
      <div title="update recommended">
        <InfoIcon />
      </div>
    )
  }
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
    <CodeBlock>
      {recommendations.map(s => {
        // List-style settings like shared_preload_libraries must be passed to ALTER SYSTEM unquoted,
        // or Postgres will treat the whole list as a single library, which of course normally does
        // not exist and the server will fail to boot, and you'll need to edit the ALTER SYSTEM file
        // that says "do not edit" or use even more convoluted workarounds to get things running again.
        const value = s.name === 'shared_preload_libraries' ? s.recommended : `'${s.recommended}'`
        return (
          <div key={s.name}>ALTER SYSTEM SET {s.name} TO {value};</div>
        )
      })}
    </CodeBlock>
  )
}

type CurrentSettings = {
  [name: string]: string
}

export const getSPLEnableAutoExplainRecommendation = (settings: CurrentSettings | undefined): PGSettingRecommendation => {
  return getAllAutoExplainRecommendations(settings).find(s => s.name === 'shared_preload_libraries');
}

export const getAutoExplainSettingRecommendations = (settings: CurrentSettings | undefined) => {
  return getAllAutoExplainRecommendations(settings).filter(s => s.name !== 'shared_preload_libraries');
}

export const getAllAutoExplainRecommendations = (settings: CurrentSettings | undefined): PGSettingRecommendation[] => {
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
      // don't recommend changing this from the default if we know you haven't set it
      if (!!settings && r.name === 'auto_explain.sample_rate') {
        return {
          ...r,
          recommendChange: false,
        }
      }
      return r;
    }
    if (r.name === 'shared_preload_libraries') {
      // We should never have an empty shared_preload_libraries here because we always expect
      // to have at least pg_stat_statements but handle it gracefully anyway to avoid surprises.
      const newPgss = current.split(/\s*,\s*/).filter(splElem => splElem !== '')
      const recommendChange = !newPgss.includes('auto_explain')
      if (recommendChange) {
        newPgss.push('auto_explain')
      }
      return {
        ...r,
        current,
        recommended: recommendChange ? newPgss.join(',') : current,
        recommendChange,
      } 
    } else if (r.name === 'auto_explain.log_min_duration') {
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
