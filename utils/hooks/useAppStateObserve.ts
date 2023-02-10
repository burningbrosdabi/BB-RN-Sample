import { useEffect } from 'react';

import { AppState, AppStateStatus } from 'react-native';
import { NotificationService } from 'services/notification';
import { unAwaited } from 'utils/helper/function.helper';

export const useAppStateObserve = (props?: {
  onActive?: () => Promise<void>;
  onBackground?: () => Promise<void>;
}) => {
  const { onActive, onBackground } = props ?? {};
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState: AppStateStatus) => {
    switch (nextAppState) {
      case 'active':
        unAwaited(NotificationService.instance.resetBadge());
        if (onActive) unAwaited(onActive());
        break;
      case 'background':
        if (onBackground) unAwaited(onBackground());
        break;
      case 'inactive':
      default:
    }
  };
};
