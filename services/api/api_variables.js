// export const apiUrl = ;
import DeviceInfo from 'react-native-device-info';

const versionName = DeviceInfo.getVersion();
let isStaging = __DEV__ || /(-staging)/g.test(versionName);

export const apiUrl = !isStaging ? 'https://api.dabi-api.com/api/' : 'https://test.dabi-api.com/api/'; // test server
