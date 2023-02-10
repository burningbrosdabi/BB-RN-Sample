import React from 'react';
import { Text, View } from 'react-native';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { applyOpacity, Colors, Outlines, Typography } from 'styles';


interface ToastOptions {
  position: number;
}

export const SimpleToastBox = (props: BaseToastProps) => {
  const { text1 } = props
  return <View style={{ padding: 12, marginHorizontal: 24, backgroundColor: applyOpacity(Colors.black, 0.7), }}>
    <Text style={{ ...Typography.name_button, textTransform: 'none', color: Colors.white, textAlign: 'center' }}>{text1}</Text>
  </View>
}



export const toast = (message: string, option?: ToastOptions) => {
  const { position = 48 + 12 + 30 } = option ?? {};

  Toast.show({
    type: 'simple',
    text1: message,
    position: 'bottom',
    bottomOffset: position,
    visibilityTime: 1500
  });

};
