import * as React from "react";66

import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
} from "react-native-svg";

function CertifiedMark(props: React.SVGProps<SVGSVGElement>) {
  const size = props.size || 12;
  return (
    <Svg viewBox="0 0 12 12" width={size} height={size} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          y1={6}
          x2={12}
          y2={6}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#fde9a6" />
          <Stop offset={1} stopColor="#fcd986" />
        </LinearGradient>
      </Defs>
      <Path fill="none" d="M0 0h12v12H0z" />
      <Circle cx={6} cy={6} r={6} fill="url(#prefix__a)" />
      <Path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M3 5.4L5.25 8 9 4"
      />
    </Svg>
  );
}

const CertifiedMarkIcon = React.memo(CertifiedMark);
export default CertifiedMarkIcon;
