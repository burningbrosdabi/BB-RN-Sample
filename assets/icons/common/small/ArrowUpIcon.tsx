import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Svg viewBox="0 0 12 12" width={12} height={12} {...props}>
      <Path fill="none" d="M0 12V0h12v12z" />
      <Path
        d="M11 8a1 1 0 01-.29.71 1 1 0 01-1.42 0L6 5.41l-3.29 3.3a1 1 0 01-1.42-1.42l4-4a1 1 0 011.42 0l4 4A1 1 0 0111 8z"
        fill="#c7cacc"
      />
    </Svg>
  );
}

const MemoArrowUpIcon = React.memo(ArrowUpIcon);
export default MemoArrowUpIcon;
