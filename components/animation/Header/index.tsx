import React, { useRef } from 'react';
import { Animated, Linking, StyleSheet, View } from 'react-native';

import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import { useNavigation } from '@react-navigation/native';

import { IconButton } from 'components/button/IconButton';

import { RoutePath } from 'routes';
import { CartRouteSetting } from 'routes/order/cart.route';
import { cartObservable } from 'services/api/cart/cart.api';
import { useNavigator } from 'services/navigation/navigation.service';

import { Colors, Typography } from 'styles';
import { getHeaderLayout } from '_helper';
import BackButton from 'components/header/BackButton';

export default ({
  animation: anim,
  title = '',
  scrollingThreshold = 100,
  icInactiveColor = 'white',
  icActiveColor = Colors.black,
  trailing = true,
  left,
  rightIcon,
  rightOnPress,
}: {
  animation?: Animated.Value;
  title: string;
  scrollingThreshold?: number;
  icInactiveColor?: string;
  icActiveColor?: string;
  trailing?: boolean;
  left?: JSX.Element;
  rightIcon?: string;
  rightOnPress?: () => void;
}) => {
  const navigator = useNavigator();

  const animation = anim ?? new Animated.Value(0);

  const onBack = () => {
    navigator.goBack();
  };

  const navigateCart = () => {
    navigator.navigate(new CartRouteSetting());
  };

  const inputRange = [0, scrollingThreshold];

  const iconAnimation = animation.interpolate({
    inputRange,
    outputRange: [icInactiveColor, icActiveColor],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          borderBottomColor: animation.interpolate({
            inputRange,
            outputRange: ['rgba(255,255,255,0)', Colors.background],
            extrapolate: 'clamp',
          }),
          backgroundColor: animation.interpolate({
            inputRange,
            outputRange: ['rgba(255,255,255,0)', 'white'],
            extrapolate: 'clamp',
          }),
        },
      ]}>
      {left ?? <BackButton leftPadding={0} />}
      <View style={{ paddingHorizontal: 24, flex: 1, alignItems: 'center' }}>
        <Animated.Text
          numberOfLines={1}
          style={[
            Typography.title,
            {
              opacity: animation.interpolate({
                inputRange,
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}>
          {title}89
        </Animated.Text>
      </View>
      {rightIcon ? (
        <IconButton icon={rightIcon} onPress={rightOnPress} animatedColor={iconAnimation} />
      ) : trailing ? (
        (navigator.currentTab === RoutePath.productDetail ||
          navigator.currentTab === RoutePath.storeDetail) && (
          <>
            <IconButton
              icon={'cart'}
              onPress={navigateCart}
              animatedColor={iconAnimation}
              badge={{
                observer: cartObservable,
                offset: { top: 8, right: 4 },
              }}
            />
          </>
        )
      ) : (
        <View style={{ width: 32 }} />
      )}
    </Animated.View>
  );
};

const { extra, height } = getHeaderLayout();

export const useGetOnScrollingAnimation = () => {
  const anim = useRef(new Animated.Value(0)).current;

  const onScroll = (rawEvent: ScrollEvent) => {
    if (rawEvent.nativeEvent.contentOffset.y < 0) return;
    Animated.event([
      {
        nativeEvent: {
          contentOffset: {
            y: anim,
          },
        },
      },
    ])(rawEvent);
  };

  return {
    onScroll,
    anim,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingTop: extra,
    height,
    position: 'absolute',
    zIndex: Number.MAX_SAFE_INTEGER,
    flexDirection: 'row',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16 - 4,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
});
