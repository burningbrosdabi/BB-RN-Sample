import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function StoreFilledIcon(props) {
  const size = props.size || 24;
  return (
    <Svg
      id="prefix__Layer_1"
      data-name="Layer1"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={12}
          y1={3.02}
          x2={12}
          y2={20.53}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
      </Defs>
      <Path
        className="prefix__cls-1"
        fill="url(#prefix__a)"
        d="M15 3h5a1 1 0 011 1v5.3a2.86 2.86 0 01-3 2.7 2.86 2.86 0 01-3-2.7 2.86 2.86 0 01-3 2.7 2.86 2.86 0 01-3-2.7A2.86 2.86 0 016 12a2.86 2.86 0 01-3-2.7V4a1 1 0 011-1h11"
      />
      <Path
        className="prefix__cls-1"
        fill="url(#prefix__a)"
        d="M20 12.5V20a1 1 0 01-1 1h-5v-3.88A2.07 2.07 0 0012.34 15 2 2 0 0010 17v4H5a1 1 0 01-1-1v-7.5a4.23 4.23 0 005-.75 4.23 4.23 0 006 0 4.23 4.23 0 005 .75z"
      />
    </Svg>
  );
}

const MemoStoreFilledIcon = React.memo(StoreFilledIcon);
export default MemoStoreFilledIcon;
