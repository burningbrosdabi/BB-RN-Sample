import { ASYNC_FUNCTION_TIMEOUT, HandledError } from 'error';
import { useEffect, useRef } from 'react';
import DeviceInfo from 'react-native-device-info';
import { isEmpty, isNil } from "lodash";
import { Linking, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import moment, { Moment } from "moment";
import axios from 'axios';
import { ProductCollectionItem } from "model/collection";
import { ProductDetail, ProductInfo } from "model";
import { dateTimeDiff } from "utils/helper/FormatHelper";

moment.locale('vi');

export const unAwaited = <T>(promise?: Promise<T>) => {
    if (!promise) return;
    promise.then().catch((_) => {
        /** */
    });
};

export const dateToString = (date?: Date) => {
    if (!date) return '';

    const month = zeroPrefix(date.getMonth() + 1);
    const dateString = zeroPrefix(date.getDate());
    const year = date.getFullYear();

    return `${dateString}.${month}.${year}`;
};

export const timeout = <T>(
    asyncFn: () => Promise<T>,
    ms: number,
    onTimeOut?: (error: Error) => void,
): Promise<T> => {
    const error = new HandledError({
        error: new Error(`[timeout] - Function exceed ${ms} ms`),
        stack: 'function.helper.timeout',
        code: ASYNC_FUNCTION_TIMEOUT,
    });
    const promsie = new Promise<T>((resolve, reject) => {
        asyncFn().then(resolve).catch(reject);
        setTimeout(() => {
            if (onTimeOut) {
                onTimeOut(error);
            }
            reject(error);
        }, ms);
    });

    return promsie;
};

export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        // Don't schedule if no delay is specified.
        if (delay === null) {
            return;
        }

        const id = setInterval(() => savedCallback.current(), delay);

        return () => clearInterval(id);
    }, [delay]);
}

const zeroPrefix = (value: number) => `${value >= 10 ? '' : '0'}${value}`;

export const removeDiacritics = (alias: string): string => {
    let str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(
        /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
        '',
    );
    str = str.replace(/ /g, '');
    str = str.trim();

    return str;
};

export const sleep = async (ms?: number): Promise<void> => {
    const promise = new Promise<null>((res) => {
        setTimeout(() => res(null), ms ?? 3000);
    });
    await promise;
};

export const guard = <T>(fn: () => T, defaultValue?: T): T | undefined => {
    try {
        return fn();
    } catch (e) {
        return defaultValue;
        /*** */
    }
};

export const asyncGuard = <T>(fn: () => Promise<T>, defaultValue?: T): Promise<T> | undefined => {
    try {
        return fn();
    } catch (e) {
        if (!isNil(defaultValue)) {
            return Promise.resolve(defaultValue);
        }
        /*** */
    }
};

export const sortData = (data: any[] = [], property: string = 'name') => {
    return data.sort(function (a: any, b: any) {
        if (a[property].toLowerCase() < b[property].toLowerCase()) {
            return -1;
        }
        if (a[property].toLowerCase() > b[property].toLowerCase()) {
            return 1;
        }
        return 0;
    });
};

export const isProduction = () => {
    const versionName = DeviceInfo.getVersion();
    const isStaging = __DEV__ || /(-staging)/g.test(versionName);

    return !isStaging;
};

export const HEADER_HEIGHT = 48;

export const getHeaderLayout = () => {
    const extra = Platform.OS === 'ios' ? getStatusBarHeight() : 0;
    return {
        extra,
        height: HEADER_HEIGHT + extra
    };
}

export const getFriendlyMomentStr = (date: string) => {
    const time = dateTimeDiff(date)

    return time ? `${time} trước` : 'Vừa xong';
}


export const postMessageToChannel = async ({
    message,
    channel
}: { message: string, channel: 'general_supporters' | 'general_feedbacks' | 'product_sentry_log' }) => {
    // if (!isProduction()) {
    //     return
    // }
    const slackToken = 'xoxb-701362502501-2563581017876-GYKOBE7bwFtmCKqDmopshzv7'
    // const headers = { "Authorization": "Bearer " + slackToken }
    let formData = new FormData();
    // formData.append('channel', 'general_supporters');
    formData.append('text', message);
    formData.append('token', slackToken);
    formData.append('channel', channel)

    try {
        const res = await axios.post('https://slack.com/api/chat.postMessage', formData)
        console.log(res.data)
    } catch (error) {
        throw new Error(error)
    }
}

export const getProductThumbnail = (data: ProductCollectionItem | ProductDetail | ProductInfo) => {
    const { thumbnail_image, product_thumbnail_image, original_thumbnail_image } = data ?? {}
    return !isEmpty(thumbnail_image)
        ? thumbnail_image
        : !isEmpty(product_thumbnail_image)
            ? product_thumbnail_image
            : original_thumbnail_image;
}

export const onPageTransitionDone = (fn: () => void) => {
    setTimeout(() => {
        fn();
    }, 520)
}

export const contactWithShop = async (facebook_numeric_id: number | string) => {
    let fn = () => {
        /***/
    };
    const messenger_link = `fb-messenger://user-thread/${facebook_numeric_id}?REF="dabi"`;
    const appInstalled = await Linking.canOpenURL(messenger_link).catch(_ => {
        return false;
    });

    if (!appInstalled) {
        return (fn = () => {
            if (Platform.OS === 'android') {
                unAwaited(Linking.openURL('market://details?id=com.facebook.orca'));
            } else {
                unAwaited(Linking.openURL('itms-apps://itunes.apple.com/app/454638411'));
            }
        });
    }
    fn = () => Linking.openURL(messenger_link);
    return fn;
};


export const shuffleList = (unShuffled: any[]) => {
    let shuffled = unShuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)

    return shuffled
}