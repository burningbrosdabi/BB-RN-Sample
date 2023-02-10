import CameraRoll from "@react-native-community/cameraroll";
import { toast } from "components/alert/toast";
import { Linking, Platform } from "react-native";
import { check, openSettings, PERMISSIONS, request, RESULTS } from "react-native-permissions";

import Share from 'react-native-share'
import {
    FacebookStoriesShareSingleOptions,
    InstagramStoriesShareSingleOptions,
    ShareAsset,
    Social
} from "react-native-share/src/types";
import AsyncStorage from "@react-native-community/async-storage";
import { storeKey } from "utils/constant";
import { isNil } from "lodash";
import { Completer } from "services/remote.config";
import { dispatch } from "utils/state";
import { showDialog } from "utils/state/action-creators";
import { ButtonType } from "components/button/Button";
import { Logger } from "services/log";

export const onSaveAlbum = async (uri: string) => {
    const granted = await hasPhotoLibraryPermission()
    if (!granted) return;
    try {
        await CameraRoll.save(uri);
        toast("Ảnh đã được lưu vào thư viện.")
    } catch (error) {
        console.log('errorr', error)
        toast("Yêu cầu truy cập vào thư viện ảnh bị từ chối.")
    }
}

interface ShareImageProps {
    title: string
    message?: string
    uri?: string
    deepLink?: string
    filename?: string

}

// Only Zalo is not working. 
export const defaultShare = async (props: ShareImageProps) => {
    const { title, message, uri, filename } = props
    const result = await Share.open({
        title,
        message,
        url: uri,
        filename,
    })
    return result.success
}

// https://react-native-share.github.io/react-native-share/docs/share-single
export const shareInstagram = async (props: ShareImageProps) => {
    try {
        Logger.instance.logSharePick('instagram');
        const { uri } = props

        const hasInsta = await Linking.canOpenURL("instagram://user");
        if (!hasInsta) {
            const is_success = defaultShare(props)
            return is_success
        }

        const shareOptions: InstagramStoriesShareSingleOptions = {
            // ...props,
            backgroundImage: uri,
            // stickerImage: uri,
            social: Social.InstagramStories,
            attributionURL: 'https://dabi.page.link'
        };
        await Share.shareSingle(shareOptions);
        return true
    } catch (e) {
        throw e;
    }
}

export const shareFacebook = async (props: ShareImageProps) => {
    try {
        Logger.instance.logSharePick('facebook');
        const { uri, deepLink } = props
        const hasFBApp = await Linking.canOpenURL("fb://profile");
        if (!hasFBApp) {
            const is_success = defaultShare(props)
            return is_success
        }

        const shareOptions: FacebookStoriesShareSingleOptions = {
            // ...props,
            backgroundImage: uri,
            method: ShareAsset.BackgroundImage,
            appId: '227758872316821',
            social: Social.FacebookStories,
            attributionURL: 'https://dabi.page.link',

        };
        Share.shareSingle(shareOptions);
        return true

    } catch (e) {
        throw e;
    }
};

enum FirstTimePermissionStatus {
    firstTime,
    allowed,
    declined
}

const requestPermissionDialog = async (): Promise<FirstTimePermissionStatus> => {
    const completer = new Completer<FirstTimePermissionStatus>();
    const isFirsTimeReq = isNil(await AsyncStorage.getItem(storeKey.photoLibPermRequested));
    if (!isFirsTimeReq) {
        completer.complete(FirstTimePermissionStatus.allowed)
    } else {
        dispatch(showDialog(
            {
                title: 'Bạn vui lòng cho phép Dabi truy cập vào hình ảnh của bạn để Dabi có thể lưu trữ và chia sẻ hình ảnh đến ứng dụng khác!',
                actions: [
                    {
                        text: 'Đồng ý', onPress: () => {
                            completer.complete(FirstTimePermissionStatus.firstTime);
                        }
                    },
                    {
                        type: ButtonType.flat, text: 'Từ chối', onPress: () => {
                            completer.complete(FirstTimePermissionStatus.declined);
                        }
                    }
                ]
            }
        ))
    }
    return completer.promise;
}

const shouldOpenSetting = () => {
    const completer = new Completer<boolean>();
    dispatch(showDialog(
        {
            title: 'Dabi không thể thực hiện chức năng này vì bạn đã từ chối cho phép quyền truy cập hình ảnh. Bạn hãy kích hoạt lại để sử dụng!',
            actions: [
                {
                    text: 'Đồng ý', onPress: () => {
                        openSettings();
                        completer.complete(false);
                    }
                },
                {
                    type: ButtonType.flat, text: 'Từ chối', onPress: () => {
                        completer.complete(false);
                    }
                }
            ]
        }
    ));
    return completer.promise;
}

export const hasPhotoLibraryPermission = async (): Promise<boolean> => {
    const isIOS = Platform.OS === 'ios';

    const firsTimeStatus = await requestPermissionDialog();

    if (firsTimeStatus === FirstTimePermissionStatus.declined) return false;


    const status = await check(
        isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    );

    if (firsTimeStatus === FirstTimePermissionStatus.firstTime) {
        await AsyncStorage.setItem(storeKey.photoLibPermRequested, 'true')
        const status = await request(
            isIOS ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        );
        return status === RESULTS.GRANTED;
    } else if (status !== RESULTS.GRANTED) {
        return shouldOpenSetting();
    }
    return status === RESULTS.GRANTED;


};