import bytes from "bytes";

export function formatBytes(value: number): string {
  return bytes.format(value, { unitSeparator: " ", decimalPlaces: 1 });
}

// format a possibly schema-qualified SQL object name
export function formatSqlObjectName(
  schemaName: string | null,
  name: string
): string {
  if (!schemaName) {
    return quoteSqlIdentifier(name);
  }

  return quoteSqlIdentifier(schemaName) + "." + quoteSqlIdentifier(name);
}

// quote identifier if needed
function quoteSqlIdentifier(identifier: string): string {
  /*
   * From quote_identifier in Postgres src/backend/utils/adt/ruleutils.c:
   *
   * Can avoid quoting if ident starts with a lowercase letter or underscore
   * and contains only lowercase letters, digits, and underscores, *and* is
   * not any SQL keyword.  Otherwise, supply quotes.
   */

  // TODO: match SQL keywords
  if (/^[a-z_][a-z0-9_]*$/.test(identifier)) {
    return identifier;
  }

  return `"${identifier.replace('"', '""')}"`;
}
