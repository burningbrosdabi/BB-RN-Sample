import React from 'react';
import { Path, Svg } from 'react-native-svg';

function ForwardIcon(props) {
  const size = props.size || 12;
  const color = props.color ? props.color : '#fe94aa';

  return (
    <Svg data-name="Layer 1" width={size} height={size} viewBox="0 0 12 12">
      <Path fill={color} d="M3.3 11.4l-.6-.8L8.2 6 2.7 1.4l.6-.8L9.8 6l-6.5 5.4z" />
    </Svg>
  );
}

export default ForwardIcon;
