import React from 'react';
import { Path, Svg } from 'react-native-svg';

function HangerIcon(props) {
  return (
    <Svg width={100} height={100} data-name="Layer 1" viewBox="0 0 100 100">
      <Path
        fill={'#fef7f8'}
        stroke={'#fe94aa'}
        strokeWidth={2}
        strokeMiterlimit={10}
        class="cls-1"
        d="M64.35 52.5H34.54L49 43.68v-.18l15.35 9z"
      />
      <Path
        fill={'transparent'}
        stroke={'#fe94aa'}
        strokeWidth={2}
        strokeMiterlimit={10}
        class="cls-2"
        d="M64.35 52.5l25.16 14.75a6 6 0 01-3.05 11.25H13.54a6 6 0 01-6-6v-.07a6.06 6.06 0 012.89-5.16L34.54 52.5M41.5 32.75V29a7.46 7.46 0 017.5-7.5 7.48 7.48 0 016.7 10.84A7.54 7.54 0 0153.45 35l-1.4 1a7.45 7.45 0 00-3 6v1.5"
      />
    </Svg>
  );
}

export default HangerIcon;
