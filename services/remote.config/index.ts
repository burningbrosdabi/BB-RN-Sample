import remoteConfig, { FirebaseRemoteConfigTypes } from '@react-native-firebase/remote-config';
import { HandledError } from 'error';
import { Logger } from 'services/log';
import { isProduction, sleep, unAwaited } from 'utils/helper/function.helper';

const force_update_version_key = 'force_update_version';
const force_update_mandatory_key = 'force_update_mandatory';
const force_update_description_key = 'force_update_description';

const home_main_list = 'home_main_list';

export enum HomeList {
    feed = 'feed', product = 'product'
}

export interface ForceUpdateInterface extends FirebaseRemoteConfigTypes.ConfigDefaults {
    [force_update_version_key]: string;
    [force_update_mandatory_key]: boolean;
    [force_update_description_key]: string;
}

const initialValue: ForceUpdateInterface = {
    [force_update_version_key]: '0.0.0',
    [force_update_mandatory_key]: false,
    [force_update_description_key]: 'Đã có phiên bản cập nhật mới.',
};

class RemoteConfigService {
    protected static _instance: RemoteConfigService;
    intializeCompleter = new Completer();

    static get instance(): RemoteConfigService {
        if (!this._instance) {
            this._instance = new this();
        }

        return this._instance;
    }

    private constructor() {
        // unAwaited(this.initialize());
    }

    async initialize(): Promise<void> {
        try {
            await remoteConfig().setConfigSettings({
                minimumFetchIntervalMillis: !isProduction() ? 0 : 6 * 60 * 60 * 1000,
            });
            await remoteConfig().setDefaults(initialValue);
            await remoteConfig().fetchAndActivate();
            this.intializeCompleter.complete(true);
        } catch (error) {
            const exception = new HandledError({
                error: error as Error,
                stack: 'RemoteConfigService.initialize',
            });
            Logger.instance.logError(exception);
            exception.log(true);
            this.intializeCompleter.complete(true);
        }
    }

    async getforceUpdateConfig(): Promise<ForceUpdateInterface> {
        try {
            await this.intializeCompleter.promise;

            return {
                [force_update_version_key]: remoteConfig().getString(force_update_version_key),
                [force_update_mandatory_key]: remoteConfig().getBoolean(force_update_mandatory_key),
                [force_update_description_key]: remoteConfig().getString(force_update_description_key),
            };
        } catch (error) {
            new HandledError({
                error: error as Error,
                stack: 'RemoteConfigService.getforceUpdateConfig',
            }).log(true);

            return initialValue;
        }
    }

    getHomeLayout(): HomeList {
        const listType = remoteConfig().getString(home_main_list);
        // return 'feed'
        if (listType === 'feed') {
            return HomeList.feed
        }
        return HomeList.product;
    }
}

export const remoteConfigService = (): RemoteConfigService => {
    return RemoteConfigService.instance;
};

export class Completer<T> {
    readonly promise: Promise<T>;
    complete!: (value: PromiseLike<T> | T) => void;
    reject!: (reason?: Error) => void;
    #isComplete = false;

    get isComplete(): boolean {
        return this.#isComplete;
    }

    constructor(params?: { onComplete: () => void }) {
        const {
            onComplete = () => {/***/
            }
        } = params ?? {}
        this.promise = new Promise<T>((resolve, reject) => {
            this.complete = (value: PromiseLike<T> | T) => {
                this.#isComplete = true;
                onComplete();

                return resolve(value)
            };
            this.reject = (reason?: Error) => {
                this.#isComplete = true;
                onComplete();

                return reject(reason);
            };
        });
    }
}
