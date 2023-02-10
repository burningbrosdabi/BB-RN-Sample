import * as React from 'react';
import { Colors } from 'styles';
import DabiFont from '../dabi.fonts';
/* SVGR has dropped some elements not supported by react-native-svg: style */

const MemoUpIcon = () => {
  return <DabiFont name={'up'}  color={Colors.primary}/>;
};
export default MemoUpIcon;
