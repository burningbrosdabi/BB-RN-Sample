import { useState } from 'react';
import NotificationSetting from 'react-native-open-notification';
import { NotificationService } from 'services/notification';
import { useAppStateObserve } from 'utils/hooks/useAppStateObserve';

export const useSwitchNotification = (): {
  switchValue: boolean;
  onSwitchValueChange: () => void;
  checkNotiPerm: () => Promise<void>;
} => {
  const [switchValue, setSwitchValue] = useState(true);

  const checkNotiPerm = async (): Promise<void> => {
    const value = await NotificationService.instance.hasPermission();
    setSwitchValue(value);
  };

  const onAppStateActive = async () => {
    await checkNotiPerm();
  };

  useAppStateObserve({
    onActive: onAppStateActive,
  });

  const onSwitchValueChange = () => {
    NotificationSetting.open();
  };

  return { switchValue, onSwitchValueChange, checkNotiPerm };
};
