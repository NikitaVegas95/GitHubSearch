import { API_NOTIFICATION_DEDUPE_MS } from '@shared/config/appConstants';

const API_NOTIFICATION_EVENT = 'api-notification';

export interface ApiNotificationPayload {
  message: string;
}

let lastMessage = '';
let lastTimestamp = 0;

export const emitApiNotification = (message: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  const now = Date.now();
  if (message === lastMessage && now - lastTimestamp < API_NOTIFICATION_DEDUPE_MS) {
    return;
  }

  lastMessage = message;
  lastTimestamp = now;

  window.dispatchEvent(
    new CustomEvent<ApiNotificationPayload>(API_NOTIFICATION_EVENT, {
      detail: { message }
    })
  );
};

export const subscribeToApiNotifications = (
  callback: (payload: ApiNotificationPayload) => void
): (() => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ApiNotificationPayload>;
    callback(customEvent.detail);
  };

  window.addEventListener(API_NOTIFICATION_EVENT, handler);

  return () => {
    window.removeEventListener(API_NOTIFICATION_EVENT, handler);
  };
};
