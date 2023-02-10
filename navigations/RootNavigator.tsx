import AsyncStorage from '@react-native-community/async-storage';
import {
  DefaultTheme,
  NavigationContainer,
  NavigationContainerRef
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ModalPopup } from 'components/alert/popUp';
import { SimpleToastBox } from 'components/alert/toast';
import { SupporterReportButton } from 'components/button/user/SupporterReportButton';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Animated, Platform, StatusBar, StyleSheet } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { CodePushSyncScreen } from 'scenes/codepush';
import AppTrackingScreen from 'scenes/onboarding/AppTrackingScreen';
import { TouristGuide } from 'services/apptour/apptour.service';
import { AppTourContext } from 'services/apptour/context';
import { JobType } from 'services/apptour/type';
import { linkService } from 'services/link/link.service';
import { NavigationService } from 'services/navigation';
import { NavigationServiceContext } from 'services/navigation/navigation.service';
import { Completer, remoteConfigService } from 'services/remote.config';
import { UpdateService } from 'services/update/update.service';
import { storeKey } from 'utils/constant';
import { unAwaited } from 'utils/helper/function.helper';
import { checkCurrentUser } from 'utils/state/action-creators';
import { Colors } from '_styles';
import MainNavigation from './MainNavigation';

// https://reactnavigation.org/docs/tab-based-navigation
// For stacking inside tab navigator

// https://reactnavigation.org/docs/typescript/
// Type Checking for react navigation
// https://velog.io/@ant-now/React-Native-with-TS-%ED%83%80%EC%9E%85%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8%EB%84%A4%EC%9D%B4%ED%8B%B0%EB%B8%8C-boilder-plate-%EB%A7%8C%EB%93%A4%EA%B8%B0-2%EC%8A%A4%ED%83%9D%EB%84%A4%EB%B9%84%EA%B2%8C%EC%9D%B4%EC%85%98-%EB%A7%8C%EB%93%A4%EA%B8%B0-React-Navigation-5.0
// https://medium.com/@seungha_kim_IT/typescript-enum%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EC%9D%B4%EC%9C%A0-3b3ccd8e5552
// https://medium.com/@thibaut.deveraux/yet-another-react-native-cheatsheet-with-typescript-c9367d1df31a
const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.white,
    text: Colors.black,
  },
};

interface Props {
  _onReady?: (navigation: any) => void;
}

function Screen() {
  const [passInitialData, setPassInitialData] = useState('true');
  const [passTutorial, setPassTutorial] = useState('true');
  const onBoardingChecked = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const touristGuide = useRef(new TouristGuide());

  const completer = useRef(
    new Completer({
      onComplete: () => {
        Animated.timing(fadeOut, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          setDoneTransition(true);
          touristGuide.current.jobs[JobType.codepush].complete();
        });
      },
    }),
  ).current;

  const fadeOut = useRef(new Animated.Value(0)).current;
  const [doneTransition, setDoneTransition] = useState(false);

  useEffect(() => {
    const checkTutorial = async () => {
      await remoteConfigService().initialize();
      const passTutorial = (await AsyncStorage.getItem(storeKey.passTutorial)) ?? 'false';

      onBoardingChecked.current = true;
      setPassTutorial(passTutorial);

      setIsLoading(false);
      touristGuide.current.run();
    };
    // tslint:disable-next-line: no-floating-promises
    unAwaited(checkTutorial());

    return () => {
      linkService().dispose();
    };
  }, []);

  useEffect(() => {
    if (
      passTutorial === 'false' ||
      !passTutorial ||
      !doneTransition ||
      !onBoardingChecked.current
    ) {
      return;
    }

  }, [passTutorial, doneTransition]);

  const onCompletelySync = async () => {
    if (completer.isComplete) return;
    await checkToken();
    await AsyncStorage.setItem(storeKey.testing, 'false');
    unAwaited(RNBootSplash.hide());
    completer.complete(undefined);
  };

  const checkToken = async () => {
    unAwaited(checkCurrentUser());
  };

  return (
    <Host>
      <AppTourContext.Provider value={{ jobs: touristGuide.current.jobs }}>
        {!isLoading && (
          <Animated.View style={{ opacity: 1, flex: 1 }}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'none',
              }}>
              {passTutorial === 'false' &&
                <>
                  {Platform.OS === 'ios' && (
                    <Stack.Screen
                      name="AppTracking"
                      component={AppTrackingScreen}
                      options={{ headerShown: false }}
                    />
                  )}
                </>}
              <Stack.Screen name="Main" component={MainNavigation} />
            </Stack.Navigator>
            <SupporterReportButton />
          </Animated.View>
        )}
        {!doneTransition && (
          <Animated.View
            style={[
              styles.splash,
              {
                opacity: fadeOut.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                }),
              },
            ]}>
            <CodePushSyncScreen onCompletelySync={onCompletelySync} />
          </Animated.View>
        )}
      </AppTourContext.Provider>
    </Host>
  );
}

const RootNavigator = ({ _onReady }: Props) => {
  const navigationRef = useRef<NavigationContainerRef>() as
    | MutableRefObject<NavigationContainerRef>
    | undefined;

  const onReady = async () => {
    if (!navigationRef?.current) return;
    await UpdateService.instance.checkUpdate();
    NavigationService.instance.container = navigationRef.current;
    _onReady && _onReady(navigationRef);
  };

  const toastConfig = {
    simple: (props: BaseToastProps) => <SimpleToastBox {...props} />,
  };

  return (
    <NavigationContainer
      theme={MyTheme}
      ref={navigationRef}
      onReady={onReady}
      onStateChange={NavigationService.instance.onStateChange}>
      <StatusBar animated backgroundColor="white" />
      <NavigationServiceContext.Provider value={NavigationService.instance}>
        <Screen />
      </NavigationServiceContext.Provider>
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
      <ModalPopup />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  splash: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    position: 'absolute',
    zIndex: 1,
    backgroundColor: Colors.surface.white,
  },
});

export default RootNavigator;
