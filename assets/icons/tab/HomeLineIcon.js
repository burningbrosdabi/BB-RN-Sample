import * as React from 'react';
import Svg, { Defs, Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function HomeLineIcon(props) {
  const size = props.size || 24;
  return (
    <Svg
      id="prefix__\uB808\uC774\uC5B4_1"
      data-name="\uB808\uC774\uC5B4 1"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      {...props}>
      <Defs></Defs>
      <Path
        className="prefix__cls-1"
        fill="#c7cacc"
        d="M21.66 10.25l-9-8a1 1 0 00-1.32 0l-9 8a1 1 0 00-.09 1.41A1 1 0 003 12v9a1 1 0 001 1h6a1 1 0 001-1v-4a1 1 0 012 0 1 1 0 002 0 3 3 0 00-6 0v3H5v-9.44l7-6.22 8.34 7.41a1 1 0 001.41-.09 1 1 0 00-.09-1.41zM20 14a1 1 0 00-1 1v5h-5a1 1 0 000 2h6a1 1 0 001-1v-6a1 1 0 00-1-1z"
      />
    </Svg>
  );
}

const MemoHomeLineIcon = React.memo(HomeLineIcon);
export default MemoHomeLineIcon;
