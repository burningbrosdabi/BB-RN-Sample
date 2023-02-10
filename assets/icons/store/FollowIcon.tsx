import * as React from 'react';
import Svg, { Defs, Path } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function FollowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Svg id="prefix__layer_1" viewBox="0 0 24 24" width={24} height={24} {...props}>
      <Defs></Defs>
      <Path
        className="prefix__cls-1"
        fill="#c7cacc"
        d="M21 22.5h-.86a1 1 0 01-.2-2 8 8 0 00-5.09-6.5A2.84 2.84 0 0113 11.38a2.92 2.92 0 011-2.16 3 3 0 10-4.92-3 3.1 3.1 0 00.15 1.93 1 1 0 01-.52 1.31A1 1 0 017.4 9a5.09 5.09 0 01-.25-3.18 4.93 4.93 0 013.7-3.66 5 5 0 014.27 1 5 5 0 01.21 7.62.92.92 0 00-.33.66.85.85 0 00.56.78A10.06 10.06 0 0122 21.5a1 1 0 01-1 1z"
      />
      <Path
        className="prefix__cls-1"
        fill="#c7cacc"
        d="M16 22.5H3a1 1 0 01-1-1 10.06 10.06 0 016.44-9.34.85.85 0 00.56-.78 1 1 0 012 0A2.84 2.84 0 019.15 14a8 8 0 00-5.09 6.5H16a1 1 0 010 2zM23 3h-1V2a1 1 0 00-2 0v1h-1a1 1 0 000 2h1v1a1 1 0 002 0V5h1a1 1 0 000-2z"
      />
    </Svg>
  );
}

const MemoFollowIcon = React.memo(FollowIcon);
export default MemoFollowIcon;
