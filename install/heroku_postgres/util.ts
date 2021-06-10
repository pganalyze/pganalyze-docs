export const collectorAppName = (organizationSlug: string) =>
  `${simpleOrgSlug(organizationSlug, '-') || "testapp"}-pganalyze-collector`;
export const attachmentName = (organizationSlug: string) =>
  organizationSlug
    ? `${simpleOrgSlug(organizationSlug).toUpperCase()}_PRIMARY`
    : "MYDB_PRIMARY";

const simpleOrgSlug = (organizationSlug: string, replacement: string = '_') => {
  if (organizationSlug == null) {
    return null;
  }
  return organizationSlug.replace(/[^a-zA-Z0-9]+/g, replacement);
}
