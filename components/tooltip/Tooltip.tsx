import AsyncStorage from '@react-native-community/async-storage';
import { RenderBox } from 'components/tutorial/type';
import { isNil } from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import { LayoutChangeEvent, Text, View, ViewStyle } from 'react-native';
import RNTooltip from 'react-native-walkthrough-tooltip';
import { Colors, Typography } from 'styles';
import { storeKey } from 'utils/constant';

export const ToolTip = ({
  cacheKey,
  text,
  children,
  placement = 'bottom',
  arrowStyle,
  tooltipStyle,
  wrapperBuilder,
  showChildInTooltip = true,
}: {
  children: JSX.Element;
  placement?: 'bottom' | 'top';
  text: string;
  cacheKey?: string;
  arrowStyle?: ViewStyle;
  tooltipStyle?: ViewStyle;
  wrapperBuilder?: (renderBox?: RenderBox) => ViewStyle;
  showChildInTooltip?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [renderBox, setRenderBox] = useState<RenderBox | undefined>();
  const onClose = () => {
    setVisible(false);
  };

  const shouldShowTooltip = async () => {
    if (!cacheKey) return true;
    const isValidKey = Object.keys(storeKey).includes(cacheKey);
    if (!isValidKey) return false;

    const value = await AsyncStorage.getItem(cacheKey);
    if (!value) {
      await AsyncStorage.setItem(cacheKey, 'true');

      return true;
    }

    return false;
  };

  const setInitialVisibility = async () => {
    const visible = await shouldShowTooltip();
    setVisible(visible);
  };

  useEffect(() => {
    setInitialVisibility();
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    if (renderBox) return;
    const { width, height, x, y } = event.nativeEvent.layout;
    setRenderBox({
      width,
      height,
      x,
      y,
    });
  };

  return (
    <RNTooltip
      disableShadow
      showChildInTooltip={showChildInTooltip}
      useInteractionManager
      arrowStyle={arrowStyle}
      tooltipStyle={tooltipStyle}
      childrenWrapperStyle={!isNil(wrapperBuilder) && wrapperBuilder(renderBox)}
      contentStyle={{ backgroundColor: Colors.blue, padding: 16 }}
      isVisible={visible}
      content={<Text style={[Typography.body, { color: Colors.white }]}>{text}</Text>}
      placement={placement}
      onClose={onClose}>
      <View onLayout={onLayout}>{children}</View>
    </RNTooltip>
  );
};

export default ToolTip;
