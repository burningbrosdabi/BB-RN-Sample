import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  const size = props.size || 12;
  return (
    <Svg id="prefix__layer_1" viewBox="0 0 24 24" width={size} height={size} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8"
          x1={12}
          y1={3.42}
          x2={12}
          y2={21.53}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#FDE9A6" />
          <Stop offset={1} stopColor="#FCD986" />
        </LinearGradient>
        <LinearGradient
          id="prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8-3"
          x1={22.5}
          y1={3.42}
          x2={22.5}
          y2={21.53}
          xlinkHref="#prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8">
          <Stop offset={0} stopColor="#FDE9A6" />
          <Stop offset={1} stopColor="#FCD986" />
        </LinearGradient>
        <LinearGradient
          id="prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8-4"
          x1={1.5}
          y1={3.42}
          x2={1.5}
          y2={21.53}
          xlinkHref="#prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8">
          <Stop offset={0} stopColor="#FDE9A6" />
          <Stop offset={1} stopColor="#FCD986" />
        </LinearGradient>
      </Defs>
      <Path
        className="prefix__cls-1"
        d="M21.57 11.18a1 1 0 00-1-.07l-3.31 1.65a2 2 0 01-2.69-.89l-1.68-3.32a1 1 0 00-1.78 0l-1.66 3.32a2 2 0 01-2.69.89l-3.31-1.65a1 1 0 00-1 .07 1 1 0 00-.42.93l1 9A1 1 0 004 22h16a1 1 0 001-.89l1-9a1 1 0 00-.43-.93z"
        fill="url(#prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8)"
      />
      <Circle
        className="prefix__cls-1"
        cx={12}
        cy={5}
        r={1.5}
        fill="url(#prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8)"
      />
      <Circle
        cx={22.5}
        cy={8.5}
        r={1.5}
        fill="url(#prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8-3)"
      />
      <Circle
        cx={1.5}
        cy={8.5}
        r={1.5}
        fill="url(#prefix__\uBB34\uC81C_\uADF8\uB77C\uB514\uC5B8\uD2B8_219_\uC0AC\uBCF8-4)"
      />
    </Svg>
  );
}

const MemoCrownIcon = React.memo(CrownIcon);
export default MemoCrownIcon;
