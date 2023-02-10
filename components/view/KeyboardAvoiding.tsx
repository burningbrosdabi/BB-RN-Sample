import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';

export const KeyboardAvoiding = ({ children }: { children: JSX.Element[] }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        enabled={Platform.OS === 'ios'}
        behavior={'padding'}
        style={{ flex: 1, paddingHorizontal: 16 }}>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};
