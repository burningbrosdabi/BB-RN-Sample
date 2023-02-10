import React from 'react';
import { Path, Svg } from 'react-native-svg';

function CheckIcon(props) {
  const size = props.size || 12;
  const color = props.color || '#fe94aa';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 12 12">
      <Path fill={color} d="M3.7 10.6L.1 3.5l1.8-.9 2.4 4.8 6.1-5.2 1.3 1.6-8 6.8z" />
    </Svg>
  );
}

export default CheckIcon;
