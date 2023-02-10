import { createContext } from 'react';

export const NotificationScreenContext = createContext<{
  unread: number;
  setUnread: (value: number) => void;
  readAllSubscription: (cb:() =>void) => () => void;
}>({
  unread: 0,
  setUnread: _ => {},
  readAllSubscription: (_) =>  () => {},
});
