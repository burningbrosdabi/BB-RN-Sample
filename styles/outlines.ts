import { ViewStyle } from 'react-native';
import Colors from './colors';
type BorderRadius = 'small' | 'base' | 'box' | 'button' | 'drawer';
export const borderRadius: Record<BorderRadius, number> = {
  small: 2,
  base: 4,
  box: 8,
  button: 0,
  drawer: 24,
};

type BorderWidth = 'base' | 'medium' | 'thick';
export const borderWidth: Record<BorderWidth, number> = {
  base: 1,
  medium: 4,
  thick: 8,
};

type BorderPreset = 'base';

export const borderPreset: Record<BorderPreset, ViewStyle> = {
  base: {
    borderRadius: borderRadius.base,
    borderWidth: borderWidth.base,
    borderColor: Colors.surface.lightGray,
  },
};
