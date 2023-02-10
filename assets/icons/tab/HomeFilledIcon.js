import * as React from 'react';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';

function HomeFilledIcon(props) {
  const size = props.size || 24;
  return (
    <Svg data-name="\uB808\uC774\uC5B4 1" viewBox="0 0 24 24" width={size} height={size} {...props}>
      <Defs>
        <LinearGradient
          id="prefix__a"
          x1={12}
          y1={2}
          x2={12}
          y2={21}
          gradientUnits="userSpaceOnUse">
          <Stop offset={0} stopColor="#ff9fb3" />
          <Stop offset={1} stopColor="#fd7694" />
        </LinearGradient>
      </Defs>
      <Path
        d="M21.67 10.25l-9-8a1 1 0 00-1.32 0l-8 7.11-1 .89a1 1 0 00-.08 1.42A1 1 0 003 12a1 1 0 00.67-.25l.33-.3V20a1 1 0 001 1h4a1 1 0 001-1v-3a2 2 0 012.34-2A2.07 2.07 0 0114 17.12V20a1 1 0 001 1h4a1 1 0 001-1v-8.55l.33.3A1 1 0 0021 12a1 1 0 00.75-.33 1 1 0 00-.08-1.42z"
        fill="url(#prefix__a)"
      />
    </Svg>
  );
}

const MemoHomeFilledIcon = React.memo(HomeFilledIcon);
export default MemoHomeFilledIcon;
