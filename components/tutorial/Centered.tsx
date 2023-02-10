import React, { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import { Dimension } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import type { RenderBox } from './type';

export const Centered = ({
  children,
  renderBox,
}: {
  children: JSX.Element;
  renderBox: RenderBox;
}) => {
  const { x, y, width, height } = renderBox;
  const [dimension, setDimension] = useState<Dimension | null>(null);

  const onLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { width, height } = nativeEvent.layout;
    setDimension({
      width,
      height,
    });
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: y + (height - (dimension?.width ?? 0)) / 2,
        left: x + (width - (dimension?.height ?? 0)) / 2,
      }}>
      <View style={{ opacity: dimension ? 1 : 0 }} onLayout={onLayout}>
        {children}
      </View>
    </View>
  );
};

export const OverLayed = () => {};
