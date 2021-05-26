export const collectorAppName = (organizationSlug: string) =>
  `${organizationSlug || "testapp"}-pganalyze-collector`;
export const attachmentName = (organizationSlug: string) =>
  organizationSlug
    ? `${organizationSlug.toUpperCase().replace("-", "_")}_PRIMARY`
    : "MYDB_PRIMARY";
