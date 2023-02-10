import React from 'react';
import { Path, Svg } from 'react-native-svg';

function LogoIcon(props) {
  const width = props.width || 44;
  const height = props.height || 30;

  const color = props.color || '#fe94aa';

  return (
    <Svg width={width} height={height} data-name="Layer 1" viewBox="0 0 44 30">
      <Path
        class="cls-1"
        fill={color}
        d="M0 30h11V0H0zM2.67 2.67h5.66v24.66H2.67zM13.67 30h2.66v-4.33H22V30h2.67V0h-11zm2.66-27.33H22V23h-5.67zM41.33 0H44v30h-2.67zM37 0h-9.67v30h11V8H37zm-7 2.67h4.33V8H30zm5.67 24.66H30V10.67h5.67z"
      />
    </Svg>
  );
}

export default LogoIcon;
