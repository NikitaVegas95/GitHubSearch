import { useEffect, useRef, useState } from 'react';

import styles from './ApiNotice.module.scss';

import { subscribeToApiNotifications } from '@shared/lib/apiNotifications';

const AUTO_HIDE_MS = 5000;

export function ApiNotice() {
  const [message, setMessage] = useState<string | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    const unsubscribe = subscribeToApiNotifications(({ message: nextMessage }) => {
      setMessage(nextMessage);

      if (hideTimeoutRef.current !== null) {
        clearTimeout(hideTimeoutRef.current);
      }

      hideTimeoutRef.current = setTimeout(() => {
        setMessage(null);
      }, AUTO_HIDE_MS);
    });

    return unsubscribe;
  }, []);

  if (!message) {
    return null;
  }

  return (
    <div className={styles.notice} role="status" aria-live="polite">
      <span>{message}</span>
      <button
        type="button"
        className={styles.close}
        onClick={() => {
          setMessage(null);
        }}
      >
        Закрыть
      </button>
    </div>
  );
}
