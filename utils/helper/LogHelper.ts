// analytics
// import appsFlyer from 'react-native-appsflyer';
// https://github.com/AppsFlyerSDK/appsflyer-react-native-plugin/issues/137ㅉk
import Analytics from 'appcenter-analytics';
import analytics from '@react-native-firebase/analytics';
import firebase from '@react-native-firebase/app';
import { Platform } from 'react-native';

// https://rnfirebase.io/analytics/usage
// Your secondary Firebase project credentials for Android...
const androidCredentials = {
  clientId: '',
  appId: '',
  apiKey: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
  projectId: '',
};

// Your secondary Firebase project credentials for iOS...
const iosCredentials = {
  clientId: '',
  appId: '',
  apiKey: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
  projectId: '',
};

// Select the relevant credentials
const credentials = Platform.select({
  android: androidCredentials,
  ios: iosCredentials,
});

const config = {
  name: 'SECONDARY_APP',
};

export async function initializeLog() {
  await firebase.initializeApp(credentials, config);
  // if (Constants.isDevice) {
  //   try {
  //     Amplitude.initialize('529efa4e3abb6326f7a2c0def8201eef');
  //     Segment.initialize({
  //       androidWriteKey: 'OqpnAVEivOsad2I8FEDv8mqX7fDNnOfH',
  //       iosWriteKey: '21D3uHbaUJw0L19M1zjeL71FfAoVLDOk',
  //     });
  //   } catch (error) {}
  // }
}

export async function logEvent(eventLog = '') {
  // // Call Action
  // if (Constants.isDevice) {
  //   try {
  //     const analytics = new Analytics('UA-144636682-2', {});
  //     analytics.hit(new ScreenHit(eventLog));
  //     Amplitude.logEvent(eventLog);
  //     Segment.screen(eventLog);
  //     await FireBaseAnalytics.logEvent(eventLog);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  console.log(eventLog);
  // AppCenter
  Analytics.trackEvent(eventLog);
}

// TODO Screen / Event 분리?
export async function logEventWithProperty(eventLog = '', property) {
  // // Event Action
  // if (Constants.isDevice) {
  //   try {
  //     const analytics = new Analytics('UA-144636682-2', {});
  //     analytics.hit(new Event(eventLog, property));
  //     Amplitude.logEventWithProperties(eventLog, property);
  //     Segment.trackWithProperties(eventLog, property);
  //     await FireBaseAnalytics.logEvent(eventLog, property);
  //   } catch (error) {}
  // }
  Analytics.trackEvent(eventLog, property);
}

// TODO 로그 추가할 수 있을지 or 추가해야하는지 Segment 추가 가능
// TODO fetch 처럼 다시 해야하는지? 굳이 그럴 필요가 있나?
