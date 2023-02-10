import LoadingIndicator from 'components/loading/LoadingIndicator';
import { HandledError } from 'error';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import CodePush from 'react-native-code-push';
import { Logger } from 'services/log';
import { Colors, Typography } from 'styles';
import { isProduction, timeout, unAwaited } from 'utils/helper/function.helper';
import { DefaultSplashScreen } from './SplashScreen';

const CHECKING_UPDATE_TIMEOUT = isProduction() ? 5000 : 10000;
const PATIENCE_TIP = 7000;
const PROCESS_TIMEOUT = 13000;
const LOADING_INDICATOR_HEIGHT = 110;
const SYNC_MESS_HEIGHT = 28;
export const CodePushSyncScreen = ({ onCompletelySync }: { onCompletelySync: () => void }) => {
  const [syncMessage, _setSyncMessage] = useState('Kiểm tra bản cập nhật');
  const [syncStatus, _setStatus] = useState<CodePush.SyncStatus>(CodePush.SyncStatus.CHECKING_FOR_UPDATE);

  const setSyncMessage = (value: string) => {
    Logger.instance.log('CODEPUSH', value);
    if (unmounted.current) return;
    _setSyncMessage(value);
  };

  const setStatus = (value: CodePush.SyncStatus) => {
    if (unmounted.current) return;
    _setStatus(value);
  };

  const [tick, setTick] = useState(0);

  const unmounted = useRef(false);
  const mandatory = useRef(false);

  let completeSync = false;

  useEffect(() => {
    CodePush.disallowRestart();
    let _tick = 0;
    const interval = setInterval(() => {
      _tick += 1000;
      setTick(_tick);
    }, 1000);

    return () => {
      clearInterval(interval);
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (tick === PROCESS_TIMEOUT) onCompletelySync();
  }, [tick]);

  const codePushStatusDidChange = (syncStatus: CodePush.SyncStatus) => {
    setStatus(syncStatus);
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        setSyncMessage('Kiểm tra bản cập nhật');
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        setSyncMessage('Tải bản cập nhật');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        setSyncMessage('Cài đặt bản cập nhật');
        break;

      case CodePush.SyncStatus.SYNC_IN_PROGRESS:
        setSyncMessage('Đang đồng bộ');
        break;

      case CodePush.SyncStatus.UP_TO_DATE:
        Logger.instance.log('CODEPUSH', 'UP_TO_DATE');
        completeSync = true;
        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        Logger.instance.log('CODEPUSH', 'UPDATE_IGNORED');
        completeSync = true;
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        Logger.instance.log('CODEPUSH', 'UPDATE_INSTALLED');
        completeSync = true;
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        Logger.instance.log('CODEPUSH', 'AWAITING_USER_ACTION');
        completeSync = true;
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        Logger.instance.log('CODEPUSH', 'UNKNOWN_ERROR');
        onCompletelySync();
        break;
      default:
        onCompletelySync();

        return;
    }

    if (!completeSync) return;
    if (!mandatory.current) {
      onCompletelySync();
    } else {
      setSyncMessage('Khởi động lại...');
      setTimeout(() => {
        if (!unmounted.current) {
          CodePush.allowRestart();
          CodePush.restartApp();
        }
      }, 1500);
    }
  };

  const sync = () => {
    unAwaited(
      CodePush.sync(
        {
          installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        },
        codePushStatusDidChange,
        () => {
          /** */
        },
      ).catch((error) => {
        new HandledError({ error: error as Error, stack: 'CodePushSyncScreen.sync' }).log(true);
      }),
    );
  };

  const checkForUpdate = async () => {
    try {
      const update = await timeout(CodePush.checkForUpdate, CHECKING_UPDATE_TIMEOUT, (_) => {
        unAwaited(
          CodePush.sync({
            installMode: CodePush.InstallMode.ON_NEXT_RESTART,
          }),
        );
      });
      if (update) {
        mandatory.current = update?.isMandatory;
        sync();
      } else onCompletelySync();
    } catch (error) {
      const exception = new HandledError({
        error: error as Error,
        stack: 'CodePushSyncScreen.checkForUpdate',
      });
      exception.log(true);
      Logger.instance.logError(exception);
      onCompletelySync();
    }
  };

  useEffect(() => {
    unAwaited(checkForUpdate());
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.black,
        alignItems: 'center',

      }}>
      {syncStatus === CodePush.SyncStatus.CHECKING_FOR_UPDATE ? (
        <DefaultSplashScreen />
      ) : (
        <View style={{ height: LOADING_INDICATOR_HEIGHT + SYNC_MESS_HEIGHT, alignItems: 'center' }}>
          <View style={{ height: LOADING_INDICATOR_HEIGHT, width: LOADING_INDICATOR_HEIGHT }}>
            <LoadingIndicator isLoading={true} fullScreen={false} />
          </View>
          <Text style={[Typography.h1, { color: Colors.primary }]}>{syncMessage}</Text>
        </View>
      )}

      {syncStatus !== CodePush.SyncStatus.CHECKING_FOR_UPDATE && tick >= PATIENCE_TIP && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ translateY: (LOADING_INDICATOR_HEIGHT + SYNC_MESS_HEIGHT) / 2 + 16 / 2 + 12 }],
          }}>
          <Text
            style={[Typography.description, { color: Colors.surface.midGray, textAlign: 'center' }]}>
            {'Sẽ mất chút thời gian, bạn đợi xíu nhé!'}
          </Text>
        </View>
      )}
    </View>
  );
};
