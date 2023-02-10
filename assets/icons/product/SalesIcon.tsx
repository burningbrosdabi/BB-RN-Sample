import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Circle, Path } from 'react-native-svg';

function SalesIcon(props: React.SVGProps<SVGSVGElement>) {
  const size = props.size || 12;

  return (
    <Svg viewBox="0 0 12 12" width={size} height={size} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={3.67}
          y1={3.71}
          x2={4.24}
          y2={4.32}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#fde9a6" />
          <Stop offset={1} stopColor="#fcd986" />
        </LinearGradient>
        <LinearGradient
          id="prefix__b"
          x1={7.67}
          y1={7.71}
          x2={8.24}
          y2={8.32}
          xlinkHref="#prefix__a"
        />
        <LinearGradient
          id="prefix__c"
          x1={2.11}
          y1={1.86}
          x2={8.87}
          y2={9.04}
          xlinkHref="#prefix__a"
        />
      </Defs>
      <Circle cx={4} cy={4.06} r={0.5} fill="url(#prefix__a)" />
      <Circle cx={8} cy={8.06} r={0.5} fill="url(#prefix__a)" />
      <Path
        d="M11.71 4.15c-.19-.59-.88-.92-1.23-1.41S10 1.5 9.53 1.15 8.29.92 7.71.73 6.62 0 6 0 4.85.55 4.29.73 3 .79 2.47 1.15s-.59 1.11-1 1.59-.99.82-1.18 1.41S.46 5.38.46 6 .11 7.29.29 7.85s.88.92 1.23 1.41.46 1.24 1 1.59 1.24.23 1.82.42S5.38 12 6 12s1.15-.55 1.71-.73 1.33-.06 1.82-.42.59-1.11 1-1.59 1-.82 1.23-1.41-.22-1.23-.22-1.85.35-1.29.17-1.85zM2.5 4.06A1.5 1.5 0 114 5.56a1.5 1.5 0 01-1.5-1.5zm1.85 4.35a.48.48 0 01-.7 0 .48.48 0 010-.7l4-4a.49.49 0 01.7.7zM8 9.56a1.5 1.5 0 111.5-1.5A1.5 1.5 0 018 9.56z"
        fill="url(#prefix__a)"
      />
      <Path fill="none" d="M0 0h12v12H0z" />
    </Svg>
  );
}

const MemoSalesIcon = React.memo(SalesIcon);
export default MemoSalesIcon;
