import * as React from 'react';
import Svg, { Defs, Path } from 'react-native-svg';
import { Colors } from 'styles';
/* SVGR has dropped some elements not supported by react-native-svg: style */

function HeartFilledWhiteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Svg id="prefix__layer_1" viewBox="0 0 24 24" width={24} height={24} {...props}>
      <Defs></Defs>
      <Path
        d="M11.29 20.15l-7.52-7.53a5.6 5.6 0 01-.53-7.48 5.45 5.45 0 018.07-.4l.69.69.52-.52A5.62 5.62 0 0120 4.38a5.45 5.45 0 01.39 8.07l-7.69 7.7a1 1 0 01-1.41 0z"
        fill={Colors.white}
        opacity={0.5}
      />
      <Path
        d="M12 21.86a1 1 0 01-.71-.3l-8.4-8.4A6.46 6.46 0 0112 4a6.46 6.46 0 019.11 9.15l-3.65 3.65a1 1 0 01-1.41 0 1 1 0 010-1.42l3.65-3.64a4.45 4.45 0 10-6.3-6.3l-.69.69a1 1 0 01-1.42 0l-.69-.69a4.45 4.45 0 00-6.3 6.3l7.7 7.7 1.16-1.16a1 1 0 011.41 0 1 1 0 010 1.42l-1.86 1.86a1 1 0 01-.71.3z"
        fill={Colors.icon}
      />
      <Path className="prefix__cls-4" d="M0 0h24v24H0z" />
      <Path className="prefix__cls-4" d="M0 0h24v24H0z" />
    </Svg>
  );
}

const MemoHeartFilledWhiteIcon = React.memo(HeartFilledWhiteIcon);
export default MemoHeartFilledWhiteIcon;
