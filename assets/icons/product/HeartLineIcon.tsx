import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function HeartLineIcon(props: React.SVGProps<SVGSVGElement>) {
  const color = props.color || '#c7cacc';
  const size = props.size || 24;
  return (
    <Svg data-name="\uB808\uC774\uC5B4 1" viewBox="0 0 24 24" width={size} height={size} {...props}>
      <Path
        d="M12 21.86a1 1 0 01-.71-.3l-8.4-8.4A6.46 6.46 0 0112 4a6.46 6.46 0 019.11 9.15l-3.65 3.65a1 1 0 01-1.41 0 1 1 0 010-1.42l3.65-3.64a4.45 4.45 0 10-6.3-6.3l-.69.69a1 1 0 01-1.42 0l-.69-.69a4.45 4.45 0 00-6.3 6.3l7.7 7.7 1.16-1.16a1 1 0 011.41 0 1 1 0 010 1.42l-1.86 1.86a1 1 0 01-.71.3z"
        fill={color}
      />
    </Svg>
  );
}

const MemoHeartLineIcon = React.memo(HeartLineIcon);
export default MemoHeartLineIcon;
