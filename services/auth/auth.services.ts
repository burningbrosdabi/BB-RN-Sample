import messaging from '@react-native-firebase/messaging';
import {HandledError} from 'error';
import DeviceInfo from 'react-native-device-info';
import {
    commentLikeController,
    feedCollectController,
    feedLikeController,
    productLikeController,
    storeLikeController,
    userFollowController
} from 'services/user';
import {AuthAPI} from '_api';
import {CommentType} from "model";

export const logout = async () => {
    try {
        feedCollectController.reset();
        feedLikeController.reset();
        productLikeController.reset();
        storeLikeController.reset();
        userFollowController.reset();
        commentLikeController[CommentType.feed].reset();
        commentLikeController[CommentType.magazine].reset();
    } catch (e) {
        const error = new HandledError({
            error: e as Error,
            stack: 'AuthService.logout',
        });
        error.log(true);
    }
};

export const login = async ({email, password}) => {
    const {res, data} = await AuthAPI.getEmailToken({email, password});
    if (res == 200) {
        return {token: data.token};
    } else {
        return {message: data};
    }
};

export const sendEmailCode = async ({email}: { email: string }) => {
    const {res, data} = await AuthAPI.sendEmailCode({email});
    console.log(data);
    if (res == 200) {
        return {data};
    } else {
        return {message: data};
    }
};

export const validateToken = async ({token}: { token: string }) => {
    const {res, data} = await AuthAPI.validateToken({token});
    console.log(data);
    if (res == 200) {
        return {data};
    } else {
        return {message: data};
    }
};

export const resetPassword = async ({password, token}: { password: string, token: string }) => {
    const {res, data} = await AuthAPI.resetPassword({password, token});
    console.log(data);
    if (res == 200) {
        return {data};
    } else {
        return {message: data};
    }
};

export const signUp = async ({email, name, password}) => {
    const {res, data} = await AuthAPI.createEmailAccount({email, name, password});
    if (res == 201) {
        const {token, message} = await login({email, password});
        if (token) {
            return {token};
        } else {
            return {message};
        }
    } else {
        return {message: data};
    }
};

export const updateUserDeviceInfo = async () => {
    try {
        const deviceId = DeviceInfo.getUniqueId();
        const fcmToken = await messaging().getToken();
        await AuthAPI.updateUserDeviceInfo(fcmToken, deviceId);
    } catch (error) {
    }
};
