import React from 'react';
import { Switch as RNSwitch } from 'react-native-switch';
import { Colors, Typography } from 'styles';

interface Props {
  initialValue: boolean;
  onChange: (val: boolean) => void;
}
export const Switch = ({
  initialValue,
  onChange = (val: boolean) => {
    /**/
  },
}: Props) => {
  return (
    <RNSwitch
      value={initialValue}
      onValueChange={onChange}
      activeText={'on'}
      inActiveText={'off'}
      circleSize={20}
      barHeight={24}
      circleBorderWidth={0}
      activeTextStyle={{ ...Typography.description, color: 'white', textTransform: 'none' }}
      inactiveTextStyle={{ ...Typography.description, color: 'white', textTransform: 'none' }}
      backgroundActive={Colors.primary}
      backgroundInactive={Colors.surface.midGray}
      circleActiveColor={Colors.white}
      circleInActiveColor={Colors.white}
      changeValueImmediately={false}
      innerCircleStyle={{ alignItems: 'center', justifyContent: 'center' }}
      outerCircleStyle={{}}
      renderActiveText
      renderInActiveText
      switchLeftPx={3.2}
      switchRightPx={3.8}
      switchWidthMultiplier={2.65}
      switchBorderRadius={12}
    />
  );
};
