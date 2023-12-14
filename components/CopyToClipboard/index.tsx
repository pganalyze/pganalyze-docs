import React, { useState, useRef, useEffect } from "react";

import { FontAwesomeIcon } from "../FontAwesomeIcon";
import { faCheck, faCopy, faSpinner, faTimes } from "@fortawesome/pro-light-svg-icons";

import styles from "./style.module.scss";

export type Props = {
  className?: string;
  content: string | (() => string | Promise<string>);
  label: string;
  title?: string;
};

export function useUnmounted(): { current: boolean } {
  const unmounted = useRef(false);
  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);
  return unmounted;
}

const CopyToClipboard: React.FunctionComponent<Props> = ({
  className,
  content,
  label,
  title,
}) => {
  const unmounted = useUnmounted();
  const [copied, setCopied] = useState(false);
  const [waitingForContent, setWaitingForContent] = useState(false);
  const [copyError, setCopyError] = useState(null);
  const { clipboard } = typeof navigator === 'object' && navigator;
  if (!clipboard) {
    return null;
  }

  const handleCopy = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (clipboard) {
      let actualContent;
      if (typeof content === "function") {
        const contentResult = content();
        if (typeof contentResult === 'string') {
          actualContent = contentResult;
        } else {
          setWaitingForContent(true);
          actualContent = await contentResult;
          setWaitingForContent(false);
        }
      } else {
        actualContent = content;
      }
      clipboard
        .writeText(actualContent)
        .then(() => {
          if (unmounted.current) {
            return;
          }

          setCopied(true);
        })
        .catch((err: Error) => {
          setCopyError(err.message);
        })
        .finally(() => {
          if (unmounted.current) {
            return;
          }

          setTimeout(() => {
            if (unmounted.current) {
              return;
            }

            setCopied(null);
          }, 2000);
        });
    }
  };

  let copyIcon;
  if (copyError) {
    copyIcon = <FontAwesomeIcon icon={faTimes} title={copyError} />;
  } else if (waitingForContent) {
    copyIcon = <FontAwesomeIcon className={styles.copyLoading} icon={faSpinner} title="Loading" />;
  } else if (copied) {
    copyIcon = <FontAwesomeIcon icon={faCheck} title="Copied!" />;
  } else {
    copyIcon = <FontAwesomeIcon icon={faCopy} title={title} />;
  }

  return (
    <a href="" className={className} onClick={handleCopy}>
      {copyIcon} {label}
    </a>
  );
};

export default CopyToClipboard;
