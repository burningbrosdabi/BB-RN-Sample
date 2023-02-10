import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { applyOpacity, Colors, Spacing, Typography } from 'styles';
import { Centered } from './Centered';
import { FeatureDiscoveryContext } from './context';
import type { IDescribedFeature, RenderBox } from './type';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const featureAreaSize = 100;

const isOnLeftHalf = (x: number) => {
  return x >= screenSize.width / 2;
};

const closeToVerticalEdge = (y: number, contentHeight: number) => {
  return (
    y <= featureAreaSize + (contentHeight ?? 0) ||
    screenSize.height - y <= featureAreaSize + (contentHeight ?? 0)
  );
};

const onTopHalfScreen = (y: number) => {
  return y < screenSize.height / 2;
};

const screenSize = Spacing.screen;

const animationDuration = 150;

export const DescribedFeature = ({
  id,
  children,
  renderBox,
  description,
  title,
  backgroundColor,
  transparent
}: IDescribedFeature) => {
  const [contentHeight, setContentHeight] = useState<number | undefined>();
  const { activeId, completeAt } = useContext(FeatureDiscoveryContext);

  const focused = useSharedValue(false);

  const visible = activeId === id;

  useEffect(() => {
    if (!visible) return;
    focused.value = true;
  }, [visible]);

  const onComplete = () => {
    focused.value = false;
  };

  // const onDismiss = () => {
  //   endAnimation(dismiss);
  // };

  if (!visible) return <></>;

  const onLayout = (e: LayoutChangeEvent) => {
    const { nativeEvent } = e;
    setContentHeight(nativeEvent.layout.height);
  };

  const getContentOrientation = (y: number) => {
    const isCloseToVerticalEdge = closeToVerticalEdge(y, contentHeight ?? 0);
    const isOnTopHalf = onTopHalfScreen(y);

    if (isCloseToVerticalEdge) {
      if (isOnTopHalf) {
        return _ContentOrientation.below;
      }

      return _ContentOrientation.above;
    } else {
      if (isOnTopHalf) {
        return _ContentOrientation.above;
      }

      return _ContentOrientation.below;
    }
  };

  const contentY = () => {
    const contentOrientation = getContentOrientation(renderBox.y);
    if (contentOrientation === _ContentOrientation.below) {
      return renderBox.y + renderBox.height / 2 + featureAreaSize / 2 + 20;
    }

    return renderBox.y - (contentHeight ?? 0) - (featureAreaSize - renderBox.height) / 2 - 20; // featureAreaSize / 2 // - (featureAreaSize / 2 + 20) // - (contentHeight ?? 0);
  };

  const isCenteredBackground = closeToVerticalEdge(renderBox.y, contentHeight ?? 0);

  const backgroundRadius = screenSize.width * (isCenteredBackground ? 1 : 0.85);

  return (
    <Ripple style={styles.container} onPress={onComplete}>
      <_Background
        focused={focused}
        renderBox={renderBox}
        isCentered={isCenteredBackground}
        backgroundColor={Colors.blue}
        radius={backgroundRadius}
      />
      <_Content
        title={title}
        description={description}
        focused={focused}
        onLayout={onLayout}
        contentY={contentY()}
      />
      <_FeatureArea onEnd={() => completeAt(id)} renderBox={renderBox} focused={focused} transparent={transparent}>
        {children}
      </_FeatureArea>
    </Ripple>
  );
};

const _Content = ({
  onLayout,
  focused,
  contentY,
  title = '',
  description,
}: {
  contentY: number;
  focused: Animated.SharedValue<boolean>;
  onLayout: (e: LayoutChangeEvent) => void;
  title?: string;
  description: string;
}) => {
  const style = useAnimatedStyle(() => {
    return {
      opacity: withDelay(focused.value ? 300 : 0, withTiming(focused.value ? 1 : 0)),
    };
  });

  return (
    <Animated.View
      onLayout={onLayout}
      style={[
        {
          position: 'absolute',
          top: contentY,
          left: 40,
          right: 40,
          alignItems: 'flex-start',
        },
        style,
      ]}>
      <Text style={[Typography.h1, { color: Colors.white }]}>{title} </Text>
      <Text style={[Typography.boxTitle, { color: Colors.white, fontSize: 16 }]}>
        {description}
      </Text>
    </Animated.View>
  );
};

const _Button = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        // backgroundColor: 'red',
        transform: [
          {
            translateX: -8,
          },
          { translateY: -4 },
        ],
      }}
      onPress={onPress}>
      <Text style={[Typography.name_button, { color: 'white' }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const _Background = ({
  radius,
  renderBox,
  isCentered,
  backgroundColor,
  focused,
}: {
  radius: number;
  renderBox: RenderBox;
  isCentered: boolean;
  backgroundColor: string;
  focused: Animated.SharedValue<boolean>;
}) => {
  const style = useAnimatedStyle(() => {
    const anim = focused.value ? withSpring(1, undefined) : withDelay(100, withTiming(0));
    return {
      transform: [
        {
          scale: anim,
        },
      ],
    };
  });

  const getBackground = (children: JSX.Element) => {
    if (isCentered) return <Centered renderBox={renderBox}>{children}</Centered>;
    const halfScreenWidth = screenSize.width / 2;

    return (
      <Centered
        renderBox={{
          ...renderBox,
          x: halfScreenWidth + (isOnLeftHalf(renderBox.x) ? -20.0 : 20.0),
          y:
            renderBox.y +
            (onTopHalfScreen(renderBox.y) ? -halfScreenWidth + 80 : halfScreenWidth - 80),
        }}>
        {children}
      </Centered>
    );
  };

  return getBackground(
    <Animated.View
      style={[
        {
          width: radius * 2,
          height: radius * 2,
          borderRadius: radius,
          backgroundColor,
        },
        style,
      ]}
    />,
  );
};

const _FeatureArea = ({
  children,
  renderBox,
  focused,
  onEnd,
  transparent = false
}: {
  children: JSX.Element;
  renderBox: RenderBox;
  focused: Animated.SharedValue<boolean>;
  onEnd: () => void;
  transparent: boolean
}) => {
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withDelay(
            focused.value ? 0 : 300,
            withTiming(
              focused.value ? 1 : 0,
              {
                duration: 150,
              },
              isFinished => {
                if (!isFinished || focused.value) return;
                runOnJS(onEnd)();
              },
            ),
          ),
        },
      ],
    };
  });

  return (
    <Centered renderBox={renderBox}>
      <Animated.View
        style={[
          {
            width: featureAreaSize,
            height: featureAreaSize,
            borderRadius: featureAreaSize / 2,
            justifyContent: 'center',
            alignItems: 'center',
            ...transparent ? { backgroundColor: 'transparent', } : { backgroundColor: 'white', }
          },
          style,
        ]}>
        {children}
      </Animated.View>
    </Centered>
  );
};

enum _ContentOrientation {
  above,
  below,
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: applyOpacity(Colors.black, 0.3),
    flex: 1,
  },
});
