import { useNavigation } from '@react-navigation/core';
import { useRoute } from '@react-navigation/native';
import Button, { ButtonState } from 'components/button/Button';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';
import { KeyboardAvoiding } from 'components/view/KeyboardAvoiding';
import { get, isEmpty, isNil } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView, Text,
  View
} from 'react-native';
import { OTPVerifyRouteSetting } from 'routes/verify/verifyPhone.route';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { phoneNumberReformat } from 'utils/helper/FormatHelper';
import { ConnectionState } from 'utils/hooks/useAsync';
import { useVerifyPhone } from 'utils/hooks/useVerifyPhone';
import {Header} from "components/header/Header";

export const PhoneVerifyScreen = () => {
  const [displayPhone, setDisplayPhone] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [phone, setPhoneValue] = useState('');
  const navigator = useNavigator();
  const route = useRoute();
  const onSuccess = get(route, 'params.onSuccess');
  const onCanceled = get(route, 'params.onCanceled') as () => void | undefined;

  const onVerifyPhone = () => {
    excecute();
  };

  const { state, excecute } = useVerifyPhone({ phone });

  useEffect(() => {
    if (state === ConnectionState.hasData || state === ConnectionState.hasEmptyData) {
      navigator.navigate(new OTPVerifyRouteSetting({ phone, onSuccess }));
    }
  }, [state]);

  const navigation = useNavigation();

  useEffect(() => {
    const subscribe = navigation.addListener('beforeRemove', () => {
      if (onCanceled) onCanceled();
    });

    return subscribe;
  }, []);

  const onChangeText = (text: string) => {
    const { errorMsg, displayedValue, value } = phoneNumberReformat(text);
    setDisplayPhone(displayedValue);
    setPhoneValue(value);
    setErrorMsg(errorMsg);
  };

  const buttonState = useMemo(() => {
    return state !== ConnectionState.waiting
      ? !isEmpty(displayPhone) && isNil(errorMsg)
        ? ButtonState.idle
        : ButtonState.disabled
      : ButtonState.loading;
  }, [state, displayPhone, errorMsg]);

  const maxLength = useMemo(() => (/^0/g.test(phone) ? 12 : 11), [phone]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header/>
      <View style={{ height: 12 }} />
      <KeyboardAvoiding>
        <Text style={[Typography.h1, { textAlign: 'center' }]}>
          {'Xác thực số điện thoại\nđể Dabi hỗ trợ bạn tốt hơn'}
        </Text>
        <View style={{ height: 24 }} />
        <View style={{ paddingHorizontal: 16 }}>
          <DEPRECATED_InputField
            maxLength={maxLength}
            labelStyle={[Typography.description, { color: Colors.black }]}
            customStyle={{ marginLeft: 0, width: '100%', paddingVertical: 12 }}
            // inputRef={(ref) => (this.emailRef = ref)}
            value={displayPhone}
            errorMsg={errorMsg}
            labelColor={Colors.black}
            labelText={'Số điện thoại'}
            textColor={Colors.text}
            onChangeText={onChangeText}
            autoCapitalize={'none'}
            comment="Số điện thoại của bạn"
            keyboardType={'phone-pad'}
            inputType={'text'}
            editable

          // onEndEditing={this.onEndEditingEmail}
          />
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ height: 48, marginBottom: 16 }}>
          <Button text={'XÁC THỰC'} onPress={onVerifyPhone} state={buttonState} />
        </View>
      </KeyboardAvoiding>
    </SafeAreaView>
  );
};
