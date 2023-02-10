import React from 'react';
import { Path, Svg } from 'react-native-svg';

function DownIcon(props) {
  const color = props.color ? props.color : '#fe94aa';
  const size = props.size || 12;
  return (
    <Svg data-name="Layer 1" width={size} height={size} viewBox="0 0 12 12">
      <Path fill={color} d="M6 9.8L.6 3.3l.8-.6L6 8.2l4.6-5.5.8.6L6 9.8z" />
    </Svg>
  );
}

export default DownIcon;
