import React from 'react';
import { Path, Svg } from 'react-native-svg';

function MuteIcon(props) {
  const size = props.size || 20;
  const color = props.color || '#fff';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 20 20">
      <Path
        fill={color}
        class="cls-1"
        d="M19.21 17.79L17 15.59V2L7.3 5.88 3.71 2.29 2.29 3.71 4.59 6H3v8h4l9.31 3.72 1.48 1.49zM15 13.59l-6-6v-.24L15 5zM5 12V8h1.59l.41.41V12zm4 .65v-2.24l3.72 3.72z"
      />
    </Svg>
  );
}

export default MuteIcon;
