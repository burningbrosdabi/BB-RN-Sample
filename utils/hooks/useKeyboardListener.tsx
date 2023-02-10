import React, {Ref, useEffect, useState} from 'react';
import { Keyboard, KeyboardEvent, View } from 'react-native';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export const useKeyboardListener = ({
  onShow,
  onHide,
}: {
  onShow?: (event: KeyboardEvent) => void;
  onHide?: (event: KeyboardEvent) => void;
}) => {
  useEffect(() => {
    const keyboardWillShowListener = onShow && Keyboard.addListener('keyboardDidShow', onShow);
    const keyboardWillHideListener = onHide && Keyboard.addListener('keyboardDidHide', onHide);

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);
};

export const useKeyboardSpacer = ({listRef}:{listRef?:KeyboardAwareScrollView | undefined}) => {
  const [newLineCount, setNewLineCount] = useState(0);

  const onChangeText = (text: string) => {
    const newLineCount = text.match(/\n/g)?.length ?? 0;
    setNewLineCount(Math.min(newLineCount, 5));
  };

  useEffect(() => {
    listRef?.scrollToEnd();
  }, [newLineCount]);

  return {
    Spacer: (
      <View>
        <View style={{ height: 72 }} />
        <View style={{ height: 10 * newLineCount }} />
      </View>
    ),
    onChangeText,
  };
};
