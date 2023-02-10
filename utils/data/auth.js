import DeviceInfo from 'react-native-device-info';

const versionName = DeviceInfo.getVersion();
let isStaging = __DEV__ || /(-staging)/g.test(versionName);

export const DEFAULT_TOKEN = !isStaging ? '5cf9ebae420e5648181f4832f92b6a03a225b4c5' : 'e892e6aec115fce8189417508b86998f28120f6f'; // test server
