import * as React from "react";
import Svg, { Defs, LinearGradient, Stop, Path } from "react-native-svg";

function PartnershipMark(props: React.SVGProps<SVGSVGElement>) {
  const size = props.size || 12;
  return (
    <Svg viewBox="0 0 12 12" width={size} height={size} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={1}
          y1={8.75}
          x2={11}
          y2={8.75}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#fde9a6" />
          <Stop offset={1} stopColor="#fcd986" />
        </LinearGradient>
        <LinearGradient
          id="prefix__b"
          x1={0.25}
          y1={3}
          x2={11.89}
          y2={3}
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
      </Defs>
      <Path
        d="M11 6.29V11a1 1 0 01-1 1H2.22A1.22 1.22 0 011 10.78V6.29a2.42 2.42 0 001 .21 2.49 2.49 0 002-1 2.5 2.5 0 004 0 2.49 2.49 0 002 1 2.42 2.42 0 001-.21z"
        fill="url(#prefix__a)"
      />
      <Path fill="none" d="M0 0h12v12H0z" />
      <Path
        d="M11.38 0H.62A.62.62 0 000 .62V4a2 2 0 004 0 2 2 0 004 0 2 2 0 004 0V.62a.62.62 0 00-.62-.62z"
        fill="url(#prefix__b)"
      />
      <Path
        stroke="#fd7694"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M4 8.6l1.5 1.73L8 7.67"
      />
    </Svg>
  );
}

const PartnershipMarkIcon = React.memo(PartnershipMark);
export default PartnershipMarkIcon;
