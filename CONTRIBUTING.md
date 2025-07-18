## Codeblocks

When adding code blocks to the pganalyze documentation, we encourage you to use
the CodeBlock component which has built-in copy functionality. If code highlighting
is not required and copying of the codeblock text is unlikely to be necessary, you
can still use the default markdown "```" block.

Do not use `<CopyCodeBlock>` directly anymore.

### For code copy with syntax highlighting
To provide syntax highlighting and a copy button, use the `<CodeBlock>` component like this.

```
<CodeBlock language="sql">
{`CREATE TABLE t1 (c1 int);`}
</CodeBlock>
```

Multi-line strings are supported, however, if there are blank lines in the code
, you must either add a space on each empty line or utilize `\n` instead of empty lines. 

(with space on empty line)
```
<CodeBlock language="sql">
{`CREATE TABLE t1 (c1 int);
 
INSERT INTO TABLE t1 (2);`}
</CodeBlock>
```

If you get build errors that point to a `<CodeBlock>`, check for blank lines and fix them.

### Options

#### language:
 - supported languages: sql, bash, json, yaml, graphql, ruby, python, text
 - defaults to "text".

#### hideCopy:
 - true/false
 - defaults to "false"

