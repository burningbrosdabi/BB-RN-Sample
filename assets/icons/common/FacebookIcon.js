import React from 'react';
import { Path, Svg } from 'react-native-svg';

function FacebookIcon(props) {
  const size = props.size || 20;
  const color = props.color || '#fff';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 20 20">
      <Path
        d="M11.49 19v-8.21h2.95l.44-3.2h-3.39v-2c0-.93.28-1.56 1.7-1.56H15v-2.9A25.13 25.13 0 0012.36 1C9.75 1 8 2.49 8 5.23v2.36H5v3.2h3V19z"
        fill={color}
      />
    </Svg>
  );
}

export default FacebookIcon;
