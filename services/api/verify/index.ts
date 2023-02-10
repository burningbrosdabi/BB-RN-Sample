import { HandledError, PhoneVerifyErrorCode, ServerError } from 'error';
import DeviceInfo from 'react-native-device-info';
import { Http } from 'services/http/http.service';
import { Logger, OTPVerifyEvent, OTPVerifyEventSuccess, PhoneVerifySuccess } from 'services/log';

export enum PhoneVerifyState {
  success,
  blocked,
}

export enum OTPMethod {
  sms = 0,
  voice = 1,
}

export const verifyPhone = async (phone: string, method?: OTPMethod): Promise<void> => {
  try {
    await Http.instance.post('v1/users/phone-verify-request/', {
      phone_number: phone,
      type: method ?? OTPMethod.sms,
      device_id: DeviceInfo.getUniqueId(),
    });
    Logger.instance.logVerifyPhone(new PhoneVerifySuccess({ phone }));
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'verify.api.verifyPhone',
    });
    if (error.rootError instanceof ServerError) {
      if (PhoneVerifyErrorCode[error.rootError.friendlyMessage]) {
        throw new HandledError({
          error: new Error('phone_verify_failed'),
          code: error.rootError.friendlyMessage,
          stack: 'verify.api.verifyPhone',
          extra: {
            phone,
          },
        });
      }
    }
    throw error;
  }
};

export const verifyOTP = async ({
  phone,
  otp,
  method,
}: {
  method: OTPMethod;
  phone: string;
  otp: string;
}) => {
  try {
    Logger.instance.logVerifyOTP(new OTPVerifyEvent({ phone, otp, method }));
    await Http.instance.post('v1/users/phone-verify-confirm/', {
      phone_number: phone,
      token: otp,
      device_id: DeviceInfo.getUniqueId(),
    });
    Logger.instance.logVerifyOTP(new OTPVerifyEventSuccess({ phone, otp, method }));
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'verify.api.verifyOTP',
    });

    if (error.rootError instanceof ServerError) {
      if (PhoneVerifyErrorCode[error.rootError.friendlyMessage]) {
        throw new HandledError({
          error: new Error('otp_verify_failed'),
          code: error.rootError.friendlyMessage,
          stack: 'verify.api.verifyOTP',
          extra: {
            method,
            phone,
            otp,
          },
        });
      }
    }
    throw new HandledError({
      error: error as Error,
      stack: 'api.verify.verifyOTP',
    });
  }
};
