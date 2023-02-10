import { default as Axios } from 'axios';
import { JSONType } from 'model/json/json.serializable';
import { unAwaited } from 'utils/helper';

class KibanaLog {
  #axios = Axios.create({
    baseURL: 'http://es.dabi-api.com/',
    headers: {
      Authorization: 'Basic ZWxhc3RpYzpkYWJpcEBzc3cwcmQ=',
    },
    timeout: 10000,
  });
  private static _instance: KibanaLog;

  constructor() {
    if (!KibanaLog._instance) {
      KibanaLog._instance = this;
    }

    return KibanaLog._instance;
  }

  static instance: KibanaLog;

  log(event: JSONType) {
    if (__DEV__) return;
    unAwaited(this.#axios.post('event-logger/_doc/', event));
  }
}

export const kibana = () => {
  return new KibanaLog();
};
