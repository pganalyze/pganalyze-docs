export const collectorAppName = (organizationSlug: string) =>
  `${simpleOrgSlug(organizationSlug, '-') || "testapp"}-pganalyze-collector`;
export const attachmentName = (organizationSlug: string) => {
  const slug = simpleOrgSlug(organizationSlug);
  return slug ? `${slug.toUpperCase()}_PRIMARY` : "MYDB_PRIMARY";
};

const simpleOrgSlug = (organizationSlug: string, replacement: string = '_') => {
  if (organizationSlug == null) {
    return null;
  }
  return organizationSlug.replace(/[^a-zA-Z0-9]+/g, replacement);
}
