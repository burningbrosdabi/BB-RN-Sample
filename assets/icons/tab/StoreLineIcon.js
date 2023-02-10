import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function StoreLineIcon(props) {
  const size = props.size || 24;
  return (
    <Svg data-name="\uB808\uC774\uC5B4 1" viewBox="0 0 24 24" width={size} height={size} {...props}>
      <Path
        d="M6 13a4.1 4.1 0 003-1.28 4.16 4.16 0 006 0A4.1 4.1 0 0018 13a3.86 3.86 0 004-3.7V3a1 1 0 00-1-1H9a1 1 0 000 2h11v5.3a1.87 1.87 0 01-2 1.7 1.87 1.87 0 01-2-1.7V6.94a1 1 0 00-2 0V9.3a1.87 1.87 0 01-2 1.7 1.87 1.87 0 01-2-1.7V6.94a1 1 0 00-2 0V9.3A1.87 1.87 0 016 11a1.87 1.87 0 01-2-1.7V4h.85a1 1 0 000-2H3a1 1 0 00-1 1v6.3a3.53 3.53 0 001 2.42V21a1 1 0 001 1h6a1 1 0 001-1v-4a1 1 0 012 0v4a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-2 0v5h-4v-3a3 3 0 00-6 0v3H5v-7.13A4.09 4.09 0 006 13z"
        fill="#c7cacc"
      />
    </Svg>
  );
}

const MemoStoreLineIcon = React.memo(StoreLineIcon);
export default MemoStoreLineIcon;
