import { Dimensions, } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

type Screen = 'width' | 'height';


export const screen: Record<Screen, number> = {
  width: Math.min(screenWidth, screenHeight),
  height: Math.max(screenWidth, screenHeight),
};

export const AUTH_RATIO_H = screenHeight / 780
export const AUTH_RATIO_W = screenWidth / 360
