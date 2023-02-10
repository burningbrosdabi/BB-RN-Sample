import {ButtonType} from 'components/button/Button';
import {Linking, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {Completer, remoteConfigService} from 'services/remote.config';
import {isProduction, unAwaited} from 'utils/helper/function.helper';
import {showDialog} from 'utils/state/action-creators';
import {store} from 'utils/state/store';
import {Colors} from "styles";

export class UpdateService {
    private static _instance: UpdateService;
    static get instance(): UpdateService {
        if (!this._instance) this._instance = new this();

        return this._instance;
    }

    private constructor() {
    }

    private onPress() {
        if (Platform.OS === 'android') {
            unAwaited(Linking.openURL('market://details?id=com.dabi.dabi'));
        } else {
            unAwaited(Linking.openURL('itms-apps://itunes.apple.com/app/1476368502'));
        }
    }

    async checkUpdate() {
        const completer = new Completer();
        if (!isProduction()) {
            return;
        }

        const {
            force_update_version,
            force_update_mandatory,
            force_update_description,
        } = await remoteConfigService().getforceUpdateConfig();
        const currentVersion = DeviceInfo.getVersion();

        if (!this.hasNewVersion(force_update_version, currentVersion)) {
            return;
        }

        const actions = [
            {
                text: 'Cập nhật',
                type: ButtonType.primary,
                onPress: this.onPress,
            },
        ];
        if (!force_update_mandatory) {
            actions.push({
                text: 'Bỏ qua',
                type: ButtonType.flat,
                onPress: () => {
                    completer.complete(undefined);
                },
            });
        }
        store.dispatch(
            showDialog({
                title: force_update_description,
                persistOnBtnPressed: force_update_mandatory,
                actions,
            }),
        );
        return completer.promise;
    }

    hasNewVersion(version: string, currentVer: string): boolean {
        try {
            const versionArray = version.split('.').map((value) => Number.parseInt(value, 10));
            const curVerArray = currentVer.split('.').map((value) => Number.parseInt(value, 10));

            if (versionArray.length < 3) return false;

            for (let i = 0; i < versionArray.length; i++) {
                if (versionArray[i] === curVerArray[i]) continue;

                return versionArray[i] > curVerArray[i];
            }

            return false;
        } catch (error) {
            return false;
        }
    }
}
