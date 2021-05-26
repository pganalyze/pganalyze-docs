import React from "react";
import classNames from "classnames";
import hljs from "highlight.js/lib/highlight";
import sql from "highlight.js/lib/languages/sql";

import * as styles from "./style.module.scss";

type Props = {
  sql: string;
  inline?: boolean;
};

// Keywords that should not be highlighted
const unhighlightedKeywords = [
  "oid",
  "date",
  "year",
  "month",
  "unique",
  "desc",
  "asc",
  "interval",
  "null",
  "not",
  "upsert",
  "name",
  "position",
  "is",
  "id",
  "cleanup",
  "query",
  "extract",
  "coalesce",
];

class SQL extends React.Component<Props> {
  preRef: HTMLElement | null | undefined;

  componentDidMount() {
    if (this.preRef) {
      hljs.registerLanguage("sql", sql);
      this.preRef && hljs.highlightBlock(this.preRef);

      this.preRef &&
        this.preRef
          .querySelectorAll(".hljs-keyword")
          .forEach((elem: HTMLElement) => {
            const keyword = elem.innerText && elem.innerText.toLowerCase();
            if (unhighlightedKeywords.indexOf(keyword) !== -1) {
              elem.className = "";
            } else {
              elem.className = styles.keyword;
            }
          });

      this.preRef &&
        this.preRef
          .querySelectorAll(".hljs-string")
          .forEach((e: HTMLElement) => {
            e.className = styles.string;
          });
      this.preRef &&
        this.preRef
          .querySelectorAll(".hljs-number")
          .forEach((e: HTMLElement) => {
            e.className = styles.number;
          });
      this.preRef &&
        this.preRef
          .querySelectorAll(".hljs-aggregate")
          .forEach((e: HTMLElement) => {
            e.className = styles.aggregate;
          });
      this.preRef &&
        this.preRef
          .querySelectorAll(".hljs-comment")
          .forEach((e: HTMLElement) => {
            e.className = styles.comment;
          });
      this.preRef &&
        this.preRef
          .querySelectorAll(".hljs-literal")
          .forEach((e: HTMLElement) => {
            e.className = "";
          });
    }
  }

  render() {
    let sql = this.props.sql;

    if (this.props.inline) {
      sql = sql.replace(/\s+/g, " ");
    } else {
      sql = sql
        .replace(/[^\S\n]+/g, " ")
        .replace(/\n\s/g, "\n")
        .replace(/\n{1,}/g, "\n");
    }

    return (
      <span
        className={classNames(
          styles.noborder,
          styles.sql,
          this.props.inline && styles.inline
        )}
        ref={(r: HTMLElement | null) => {
          this.preRef = r;
        }}
      >
        {sql}
      </span>
    );
  }
}

export default SQL;
