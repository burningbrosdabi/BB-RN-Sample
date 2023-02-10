import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  const color = props.color || '#c7cacc';
  return (
    <Svg viewBox="0 0 12 12" width={12} height={12} {...props}>
      <Path fill="none" d="M0 0h12v12H0z" />
      <Path
        d="M4 11a1 1 0 01-.71-.29 1 1 0 010-1.42L6.59 6l-3.3-3.29a1 1 0 011.42-1.42l4 4a1 1 0 010 1.42l-4 4A1 1 0 014 11z"
        fill={color}
      />
    </Svg>
  );
}

const MemoArrowRightIcon = React.memo(ArrowRightIcon);
export default MemoArrowRightIcon;
