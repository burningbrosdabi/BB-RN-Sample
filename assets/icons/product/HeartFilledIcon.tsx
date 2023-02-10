import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

function HeartFilledIcon(props: React.SVGProps<SVGSVGElement>) {
  const size = props.size || 24;
  return (
    <Svg data-name="\uB808\uC774\uC5B4 1" viewBox="0 0 24 24" width={size} height={size} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={12.02}
          y1={3.14}
          x2={12.02}
          y2={20.44}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
      </Defs>
      <Path
        d="M11.29 20.15l-7.52-7.53a5.6 5.6 0 01-.53-7.48 5.45 5.45 0 018.07-.4l.69.69.52-.52A5.62 5.62 0 0120 4.38a5.45 5.45 0 01.39 8.07l-7.69 7.7a1 1 0 01-1.41 0z"
        fill="url(#prefix__a)"
      />
    </Svg>
  );
}

const MemoHeartFilledIcon = React.memo(HeartFilledIcon);
export default MemoHeartFilledIcon;
