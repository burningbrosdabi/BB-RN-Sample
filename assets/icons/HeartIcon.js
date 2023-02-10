import React from 'react';
import { Path, Svg } from 'react-native-svg';

function HeartIcon(props) {
  const size = props.size || 20;
  const color = props.color || '#fe94aa';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 20 20">
      <Path
        d="M14.05 3.64l3.33 3.88L10 16.38 2.62 7.52 6 3.64l4 5.06 4.05-5.06M14 .5l-4 5-4-5-6 7 10 12 10-12-6-7z"
        fill={color}
      />
    </Svg>
  );
}

export default HeartIcon;
