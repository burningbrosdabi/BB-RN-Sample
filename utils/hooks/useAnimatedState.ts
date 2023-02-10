import { useState } from 'react';
import { LayoutAnimation, Platform } from 'react-native';

export const useAnimatedState = <T>(value: T): [T, (value: T) => void] => {
  const [state, _setState] = useState<T>(value);

  const setState = (value: T) => {
    if (Platform.OS === 'ios') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }

    return _setState(value);
  };

  return [state, setState];
};
