import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { applyFakeOpacity, Colors, Typography } from 'styles';
import { Platform, Text, TextInput, View } from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';
import { get } from 'lodash';
import { unAwaited } from 'utils/helper/function.helper';
import { Logger } from 'services/log';
import { fontBold } from 'styles/typography';

export enum VerifyState {
  idle,
  valid,
  error,
}

export type OTPInputProps = {
  state?: VerifyState;
  setVerifyState: (state: VerifyState) => void;
};

export type OTPRef = {
  getText: () => string;
  clearText: () => void;
};

export const OTPInput = forwardRef(
  ({ state = VerifyState.idle, setVerifyState }: OTPInputProps, ref) => {
    // const [state, setState] = useState(verifyState);

    const [otp, setOTP] = useState('');
    const onChange = (value: string) => {
      const otp = value.replace(/\D/g, '');
      setOTP(otp);
      if (state !== VerifyState.idle) {
        setVerifyState(VerifyState.idle);
      }
    };

    useEffect(() => {
      if (otp.length === 5) {
        setVerifyState(VerifyState.valid);
      }
    }, [otp]);

    useImperativeHandle<unknown, OTPRef>(
      ref,
      () => ({
        getText: () => otp,
        clearText: () => setOTP(''),
      }),
      [otp],
    );

    useEffect(() => {
      if (Platform.OS === 'android') {
        unAwaited(startListeningForOtp());
      }
      return () => {
        if (Platform.OS === 'android') RNOtpVerify.removeListener();
      };
    }, []);

    const startListeningForOtp = async () => {
      try {
        await RNOtpVerify?.getOtp();
        RNOtpVerify.addListener(otpHandler);
      } catch (error) {
        Logger.instance.logError(error);
      }
    };

    const otpHandler = (message: string) => {
      const regEx = /(\d{5})/g;
      console.log(message);
      const regExecArray = regEx.exec(message);
      const otp = get(regExecArray, '[1]', '') as string;
      setOTP(otp);
    };

    return (
      <View style={{ alignItems: 'flex-end' }}>
        <TextInput
          value={otp}
          maxLength={5}
          keyboardType={'numeric'}
          placeholder={'Nhập mã'}
          onChangeText={onChange}
          style={[
            Typography.h1,
            {
              width: '100%',
              textAlign: 'center',
              borderRadius: 4,
              height: 48,
              backgroundColor:
                state === VerifyState.error
                  ? applyFakeOpacity(Colors.primary, 0.3)
                  : Colors.background,
            },
          ]}
        />
        {state === VerifyState.error && (
          <View>
            <View style={{ height: 8 }} />
            <Text
              style={[Typography.smallCaption, { color: Colors.primary, fontFamily: fontBold }]}>
              Mã xác thực không đúng. Vui lòng kiểm tra lại.
            </Text>
          </View>
        )}
      </View>
    );
  },
);
