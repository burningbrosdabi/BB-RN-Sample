import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 12 12" width={12} height={12} {...props}>
      <Path fill="none" d="M12 0v12H0V0z" />
      <Path
        d="M1 4a1 1 0 01.29-.71 1 1 0 011.42 0L6 6.59l3.29-3.3a1 1 0 111.42 1.42l-4 4a1 1 0 01-1.42 0l-4-4A1 1 0 011 4z"
        fill="#c7cacc"
      />
    </Svg>
  );
}

const MemoArrowDownIcon = React.memo(ArrowDownIcon);
export default MemoArrowDownIcon;
