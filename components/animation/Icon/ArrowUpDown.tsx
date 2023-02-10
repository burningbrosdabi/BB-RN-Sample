import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import DabiFont from 'assets/icons/dabi.fonts';
import { Colors } from 'styles';

export default ({ value }: { value: 0 | 1 }) => {
  const focusedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(focusedAnim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            rotate: focusedAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '-180deg'],
            }),
          },
        ],
      }}>
      <DabiFont color={Colors.icon} size={12} name={'small_arrow_up'} />
    </Animated.View>
  );
};
