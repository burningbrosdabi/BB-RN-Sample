import DabiFont from 'assets/icons/dabi.fonts';
import React from 'react';
import Ripple from 'react-native-material-ripple';
import { Colors } from 'styles';

export const CheckBox = ({
  size = 24,
  value,
  color = Colors.primary,
  toogle,
  disabled = false,
}: {
  size?: number;
  value: boolean;
  color?: string;
  toogle: () => void;
  disabled?: boolean;
}) => {
  return (
    <Ripple
      disabled={disabled}
      onPress={toogle}
      rippleContainerBorderRadius={size / 2}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: color,
        backgroundColor: value ? color : 'transparent',
      }}>
      {value ? <DabiFont size={12} color={'white'} name={'small_check'} /> : <></>}
    </Ripple>
  );
};
