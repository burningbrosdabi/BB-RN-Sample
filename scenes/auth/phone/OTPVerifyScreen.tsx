import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Button,
  ButtonState,
  ButtonType,

} from 'components/button/Button';
import { Link } from 'components/button/Link';
import { OTPInput, OTPRef, VerifyState } from 'components/inputs/OTPInput';

import { KeyboardAvoiding } from 'components/view/KeyboardAvoiding';
import { PhoneVerifyErrorCode } from 'error';
import HandledError from 'error/error';
import { get } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnSuccessCb, VerifyBlockedRouteSetting } from 'routes/verify/verifyPhone.route';
import { OTPMethod, verifyOTP } from 'services/api/verify';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { unAwaited } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useVerifyPhone } from 'utils/hooks/useVerifyPhone';
import { CountdownDescription, CountdownState } from './OTPCountdown';
import { Header } from "components/header/Header";

export const OTPVerifyScreen = () => {
  const route = useRoute();
  const phone = get(route, 'params.phone', '') as string;
  const onSuccess = get(route, 'params.onSuccess', (number: string) => { }) as OnSuccessCb;

  const [coundownState, setCountdownState] = useState(CountdownState.idle);
  const [method, setMethod] = useState(OTPMethod.sms);
  const { showDialog, setLoading } = useActions();
  const countdonwRef = useRef<{ start: () => void } | null>(null);
  const otpRef = useRef<OTPRef | null>(null);
  const [verifyState, setVerifyState] = useState(VerifyState.idle);
  const navigator = useNavigator();
  const removeBackListener = useBackNavigateListener();

  const { excecute, error, state } = useAsync(() =>
    verifyOTP({
      phone,
      otp: otpRef?.current?.getText() ?? '',
      method,
    }),
  );

  const onVerifyOTP = () => {
    setLoading(true);
    unAwaited(
      excecute().finally(() => {
        setLoading(false);
      }),
    );
  };

  useEffect(() => {
    if (!error) return;

    const exception = new HandledError({
      error,
      stack: 'OTPVerifyScreen.onVerifyOTP',
    });

    exception.log(true);

    if (exception.code === PhoneVerifyErrorCode.INCORRECT_OTP) {
      setVerifyState(VerifyState.error);

      return;
    } else if (exception.code === PhoneVerifyErrorCode.ACCOUNT_HAS_BEEN_BLOCKED) {
      navigator.navigate(new VerifyBlockedRouteSetting());

      return;
    }
    showDialog({
      title: 'Không thể xác thực số điện thoại',
      description: exception.friendlyMessage,
      actions: [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
    });
  }, [error]);

  useEffect(() => {
    if (state === ConnectionState.hasData || state === ConnectionState.hasEmptyData) {
      removeBackListener();
      onSuccess(phone);
      navigator.goBack();
      navigator.goBack();
    }
  }, [state]);

  const onChangeCountdownState = (state: CountdownState) => {
    setCountdownState(state);
  };

  const onCallVerify = () => {
    setMethod(OTPMethod.voice);
    showDialog({
      title: `Bạn sẽ nhận được cuộc gọi xác thực đến số điện thoại ${phone}`,
      actions: [
        {
          text: 'Gọi cho tôi',
          onPress: () => {
            confirmedCall();
          },
        },
        {
          text: 'Hủy',
          type: ButtonType.flat,
          onPress: () => { },
          textStyle: { color: Colors.primary },
        },
      ],
    });
  };

  const onBlocked = () => {
    removeBackListener();
    navigator.goBack();
  };

  const { excecute: verifyPhone } = useVerifyPhone({ phone, method: OTPMethod.voice, onBlocked });

  const confirmedCall = useCallback(() => {
    setVerifyState(VerifyState.idle);
    otpRef.current?.clearText();
    countdonwRef?.current?.start();
    verifyPhone();
  }, [method]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header />
      <KeyboardAvoiding>
        <View style={{ height: 12 }} />
        <Text style={[Typography.h1, { textAlign: 'center' }]}>Xác thực số điện thoại</Text>
        <View style={{ height: 12 }} />
        <View style={{ paddingHorizontal: 36 }}>
          <Text
            style={[
              Typography.description,
              { textAlign: 'center' },
            ]}>{`Mã xác thực OTP đã được gửi đến số điện thoại ${phone}. Hãy kiểm tra tin nhắn và nhập mã xác thực ngay!`}</Text>
        </View>
        <View style={{ height: 12 }} />
        <CountdownDescription
          ref={countdonwRef}
          //  onRestart={onRestart}
          onChangeState={onChangeCountdownState}
        />
        <View style={{ height: 12 }} />
        <View style={{ paddingHorizontal: 12 }}>
          <OTPInput ref={otpRef} state={verifyState} setVerifyState={setVerifyState} />
        </View>
        <View style={{ height: 48 }} />
        <Text style={[Typography.name_button, { color: Colors.primary, textAlign: 'center' }]}>
          Bạn không nhận được mã OTP?
        </Text>
        <Link
          disabled={coundownState !== CountdownState.stop}
          text={'Gọi Dabi ngay'}
          onPress={onCallVerify}
        />
        <View style={{ flex: 1 }} />
        <View style={{ height: 48 }}>
          <Button
            state={verifyState === VerifyState.valid ? ButtonState.idle : ButtonState.disabled}
            onPress={onVerifyOTP}
            text={'Xác thực'}
          />
        </View>
        <View style={{ height: 16 }} />
      </KeyboardAvoiding>
    </SafeAreaView>
  );
};

const useBackNavigateListener = () => {
  const navigation = useNavigation();
  const { showDialog } = useActions();

  const onBack = useMemo(
    () => (e: any) => {
      e.preventDefault();
      showDialog({
        title:
          'Bạn đang xác thực số điện thoại. Vui lòng hoàn tất xác thực, nếu không sẽ bị khóa trong 30 phút. Bạn vẫn muốn rời đi?',
        actions: [
          {
            text: 'tiếp tục xác thực',
            onPress: () => { },
          },
          {
            text: 'Tôi muốn rời đi',
            type: ButtonType.flat,
            onPress: () => {
              navigation.dispatch(e.data.action);
            },
            textStyle: { color: Colors.primary },
          },
        ],
      });
    },
    [navigation],
  );

  useEffect(() => {
    navigation.addListener('beforeRemove', onBack);
  }, []);

  return () => {
    navigation.removeListener('beforeRemove', onBack);
  };
};
