import { isNil } from 'lodash';
import React from 'react';
import { Animated } from 'react-native';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { Colors } from 'styles';
import config from './config.json';
const _DabiFont = createIconSetFromFontello(config, 'fontello');

export const fontUnicodeMap: { [key: string]: string } = {
  plus: '\uE807',
  // 'bin-1': '\uE801',
  back: '\uE809',
  chat: '\uE80B',
  // cart: '\uE81B',
  search: '\uE818',
  bookmark: '\uE801',
  share: '\uE81C',
  setting: '\uE81B',
};

export default ({
  name,
  color = Colors.black,
  animatedColor,
  size = 24,
  paddingLeft = 0,
  paddingRight = 0
}: {
  name: string;
  color?: string;
  animatedColor?: Animated.AnimatedInterpolation;
  size?: number;
  paddingLeft?: number;
  paddingRight?: number;
}) => {
  if (!isNil(animatedColor)) {
    return (
      <Animated.Text
        style={{
          fontFamily: 'fontello',
          fontSize: 24,
          color: animatedColor,
        }}>
        {fontUnicodeMap[name]}
      </Animated.Text>
    );
  }

  return <_DabiFont name={name} style={{ color, paddingLeft, paddingRight }} size={size} />;
};
