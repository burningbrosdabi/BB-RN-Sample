import messaging from '@react-native-firebase/messaging';
import * as Sentry from '@sentry/react-native';

import { FeatureDiscovery } from 'components/tutorial';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import CodePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-url-polyfill/auto';
import { Provider } from 'react-redux';
import { apiUrl } from 'services/api/api_variables';
import { NotificationService } from 'services/notification';
import { UpdateService } from 'services/update/update.service';
import { unAwaited } from 'utils/helper/function.helper';
import { useAppStateObserve } from 'utils/hooks/useAppStateObserve';
import { Navigator } from '_navigations';
import { store, persistor } from './utils/state';
import { PersistGate } from 'redux-persist/integration/react';
import { enableScreens } from 'react-native-screens';
import LoadingModal from 'components/loading/LoadingModal';
import { ModalDialog } from 'components/alert/dialog';
import { ModalPopup } from 'components/alert/popUp';
import { commentLikeController } from "services/user";
import { CommentType } from "model";
import { ReactionView } from "scenes/feed/Reaction/ReactionView";


const routingInstrumentation = new Sentry.ReactNavigationV5Instrumentation();
const tracingUrl = apiUrl.substring(apiUrl.indexOf(':') + 3);

Sentry.init({
  dsn: 'https://91980bdcbd3446dba5d464c11596da39@o564918.ingest.sentry.io/5705941',
  enabled: !__DEV__,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      tracingOrigins: ['localhost', tracingUrl, /^\//],
    }),
  ],
});

// @ts-expect-error
if (Text.defaultProps == null) Text.defaultProps = {};
// @ts-expect-error
Text.defaultProps.allowFontScaling = false;

// TODO Update Check 랑 Data Loading 에 대한 로직 변경 필요함.
// Need to setup on Android https://medium.com/@appstud/add-a-splash-screen-to-a-react-native-app-810492e773f9
const App: React.FunctionComponent = () => {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useAppStateObserve();
  enableScreens(true)

  useEffect(() => {
    NotificationService.instance.handleInitialMessage();
    requestUserPermission();
    appsFlyer.initSdk(
      {
        devKey: 'FYqYNox3dLfPowRgnpFTRZ',
        isDebug: false,
        appId: '1476368502',
        onInstallConversionDataListener: __DEV__ ? false : true, // Optional
        onDeepLinkListener: __DEV__ ? false : true, // Optional
      },
      result => { },
      error => {
        console.error(error);
      },
    );
    return (() => {
      commentLikeController[CommentType.feed].reset();
      commentLikeController[CommentType.magazine].reset()
    })
  }, []);

  const onReady = (navigation: any) => {
    routingInstrumentation.registerNavigationContainer(navigation);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FeatureDiscovery>
          <ReactionView>
            <SafeAreaProvider>
              <Navigator _onReady={onReady} />
              <LoadingModal />
              <ModalDialog />
            </SafeAreaProvider>
          </ReactionView>
        </FeatureDiscovery>
      </PersistGate>
    </Provider>
  );
};

export default CodePush({ checkFrequency: CodePush.CheckFrequency.MANUAL })(App);
