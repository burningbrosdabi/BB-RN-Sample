import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CheckMarkIcon(props) {
  const size = props.size || 12;
  const color = props.color || "#c7cacc";
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" {...props}>
      <Path fill="none" d="M0 0h12v12H0z" />
      <Path
        d="M4.72 10.41L.28 5.79a1 1 0 111.44-1.38l3.06 3.18 5.53-5.31a1 1 0 111.38 1.44z"
        fill={color}
      />
    </Svg>
  );
}

const MemoCheckMarkIcon = React.memo(CheckMarkIcon);
export default MemoCheckMarkIcon;
