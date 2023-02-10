import * as React from "react";
import Svg, { Defs, LinearGradient, Stop, Path } from "react-native-svg";

function VoucherIcon(props: React.SVGProps<SVGSVGElement>) {
  const size = props.size || 22;
  const color = props.color || "url(#prefix__a)";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={1}
          y1={12}
          x2={23}
          y2={12}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
      </Defs>
      <Path fill="none" d="M0 0h24v24H0z" />
      <Path
        d="M23 10V8a2 2 0 00-2-2H8v2H7V6H3a2 2 0 00-2 2v2a2 2 0 010 4v2a2 2 0 002 2h4v-2h1v2h13a2 2 0 002-2v-2a2 2 0 010-4zM8 14H7v-4h1z"
        fill={color}
      />
      <Path
        d="M11.94 12.11a2 2 0 01-.38-1.29 1.92 1.92 0 01.38-1.28A1.32 1.32 0 0113 9.1a1.32 1.32 0 011 .44 1.92 1.92 0 01.38 1.28 2 2 0 01-.38 1.29 1.32 1.32 0 01-1 .44 1.32 1.32 0 01-1.06-.44zm1.49-.46a1.74 1.74 0 00.14-.83 1.89 1.89 0 00-.14-.82.51.51 0 00-.88 0 1.83 1.83 0 00-.14.82 1.88 1.88 0 00.14.83.47.47 0 00.44.25.46.46 0 00.44-.25zm.27 3.25a.42.42 0 01-.21.06.35.35 0 01-.25-.1.36.36 0 01-.11-.26.6.6 0 01.08-.28l2.91-5a.55.55 0 01.18-.19.42.42 0 01.21-.13.35.35 0 01.25.1.36.36 0 01.11.26.6.6 0 01-.08.28l-2.91 5a.55.55 0 01-.18.26zm2.3-.46a2 2 0 01-.37-1.3 1.88 1.88 0 01.37-1.28 1.3 1.3 0 011-.43 1.28 1.28 0 011 .44 1.92 1.92 0 01.38 1.28 2 2 0 01-.38 1.29 1.47 1.47 0 01-2.1 0zm1.45-.44a1.72 1.72 0 00.15-.83 1.68 1.68 0 00-.15-.82.46.46 0 00-.44-.25.47.47 0 00-.44.25 1.83 1.83 0 00-.14.82 1.88 1.88 0 00.14.83.49.49 0 00.44.25.48.48 0 00.44-.25z"
        fill="#fff"
      />
    </Svg>
  );
}

const MemoVoucherIcon = React.memo(VoucherIcon);
export default MemoVoucherIcon;
