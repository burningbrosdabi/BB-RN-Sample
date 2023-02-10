import React from 'react';
import { Path, Svg } from 'react-native-svg';

function InstaIcon(props) {
  const size = props.size || 20;
  const color = props.color || '#fff';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 20 20">
      <Path
        fill={color}
        class="cls-1"
        d="M16 2a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h12m0-2H4a4 4 0 00-4 4v12a4 4 0 004 4h12a4 4 0 004-4V4a4 4 0 00-4-4z"
      />
      <Path
        fill={color}
        class="cls-1"
        d="M10 7a3 3 0 11-3 3 3 3 0 013-3m0-2a5 5 0 105 5 5 5 0 00-5-5zM15 3.5a1 1 0 101 1 1 1 0 00-1-1z"
      />
    </Svg>
  );
}

export default InstaIcon;
