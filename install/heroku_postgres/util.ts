export const collectorAppName = (organizationSlug: string) =>
  `${organizationSlug || "testapp"}-pganalyze-collector`;
export const attachmentName = (organizationSlug: string) =>
  organizationSlug
    ? `${organizationSlug.toUpperCase()}_PRIMARY`
    : "MYDB_PRIMARY";
