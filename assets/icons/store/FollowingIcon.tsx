import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

function FollowingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={12}
          y1={2.53}
          x2={12}
          y2={21.11}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
        <LinearGradient id="prefix__b" x1={21} y1={2.53} x2={21} y2={21.11} xlinkHref="#prefix__a">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
      </Defs>
      <Path
        d="M3.07 20.38a9 9 0 015.73-7.29 1.84 1.84 0 001.2-1.71A1.92 1.92 0 009.33 10a4 4 0 115.34 0 1.92 1.92 0 00-.67 1.38 1.84 1.84 0 001.2 1.71 9 9 0 015.73 7.29 1 1 0 01-1 1.12H4.07a1 1 0 01-1-1.12z"
        fill="url(#prefix__a)"
      />
      <Path
        d="M20 6a1.15 1.15 0 01-.26 0 1 1 0 01-.63-.52l-1-2a1 1 0 111.78-.9l.5 1 2.06-1.37a1 1 0 111.1 1.66l-3 2A1 1 0 0120 6z"
        fill="url(#prefix__b)"
      />
    </Svg>
  );
}

const MemoFollowingIcon = React.memo(FollowingIcon);
export default MemoFollowingIcon;
