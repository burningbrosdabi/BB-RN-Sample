import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { EmojiData } from 'scenes/feed/Reaction/type';
import { ReactionContext } from 'scenes/feed/Reaction/context';
import { Dimension } from 'recyclerlistview/dist/reactnative/core/dependencies/LayoutProvider';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  runOnJS,
  runOnUI,
} from 'react-native-reanimated';
import { Offset } from 'components/tutorial/type';
import { isNil } from 'lodash';

export const ReactionView = ({ children }: { children: JSX.Element }) => {
  const [emoji, setEmoji] = useState<EmojiData>();
  const layoutRef = useRef<Dimension>({ width: 0, height: 0 });

  const _onLayout = (e: LayoutChangeEvent) => {
    layoutRef.current = {
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    };
  };

  return (
    <ReactionContext.Provider value={{ setEmoji }}>
      <View onLayout={_onLayout} style={{ flex: 1 }}>
        {children}
      </View>
      {!isNil(emoji) && <_AnimatedEmoji emoji={emoji} layoutRef={layoutRef?.current} />}
    </ReactionContext.Provider>
  );
};
const translateResizeDuration = 300;
const _AnimatedEmoji = ({ layoutRef, emoji }: { layoutRef: Dimension; emoji: EmojiData }) => {
  const { x, y } = emoji.renderBox;
  const position = useSharedValue<Offset>({ x, y });
  const size = useSharedValue(24);
  const fadeOut = useSharedValue(1);

  const { setEmoji } = useContext(ReactionContext);

  useEffect(() => {
    if (!emoji) return;
    const maxSize = 72;
    position.value = {
      x: (layoutRef.width - maxSize) / 2,
      y: (layoutRef.height - maxSize) / 2,
    };

    size.value = withTiming(
      58,
      {
        duration: translateResizeDuration,
      },
      isFinished => {
        if (isFinished) {
          runOnJS(onFinishShowUp)();
        }
      },
    );
  }, [emoji]);

  const onFinishFadeout = () => {
    setEmoji(undefined);
  };

  const onFinishShowUp = () => {
    fadeOut.value = withDelay(
      800,
      withTiming(0, {
        duration:300,
        easing:Easing.out(Easing.quad)
      }, isFinished => {
        if (isFinished) {
          runOnJS(onFinishFadeout)();
        }
      }),
    );
  };

  const style = useAnimatedStyle(() => {
    if (!position.value) return {};
    const config = {
      duration: translateResizeDuration,
      easing: Easing.inOut(Easing.quad),
    };
    return {
      top: withTiming(position.value.y, config),
      left: withTiming(position.value.x, config),
      opacity: fadeOut.value,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      fontSize: size.value,
    };
  });
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: 100
        },
        style,
      ]}>
      <Animated.Text style={[{ color: 'white' }, textStyle]}>
        {emoji?.emoji}
      </Animated.Text>
    </Animated.View>
  );
};
