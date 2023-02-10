import React from 'react';
import { Path, Svg } from 'react-native-svg';

function SoundIcon(props) {
  const size = props.size || 20;
  const color = props.color || '#fff';
  return (
    <Svg width={size} height={size} data-name="Layer 1" viewBox="0 0 20 20">
      <Path
        fill={color}
        class="cls-1"
        d="M3 6v8h4l10 4V2L7 6zm2 6V8h2v4zm10 3.05l-6-2.4v-5.3L15 5z"
      />
    </Svg>
  );
}

export default SoundIcon;
