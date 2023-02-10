import React from 'react';
import { Circle, Defs, LinearGradient, Stop, Svg } from 'react-native-svg';

function MultiColorIcon(props) {
  const size = props.size || 24;
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 40 40">
      <Defs>
        <LinearGradient
          id="a"
          x1="20"
          y1="0.44"
          x2="20"
          y2="39.95"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset="0" stopColor="#ff77a1" />
          <Stop offset="0.33" stopColor="#ffd395" />
          <Stop offset="0.67" stopColor="#6fd9ac" />
          <Stop offset="1" stopColor="#867ff5" />
        </LinearGradient>
      </Defs>
      <Circle cx="20" cy="20" r="20" fill="url(#a)" />
    </Svg>
  );
}

export default MultiColorIcon;
