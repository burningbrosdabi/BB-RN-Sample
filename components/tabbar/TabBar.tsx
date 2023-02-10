import { FeatureMeasurement } from 'components/tutorial';
import { FeatureIds } from 'components/tutorial/type';
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  EasingNode,
  Node,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NavigationState, Route, SceneRendererProps } from 'react-native-tab-view';
import { Colors, Typography } from 'styles';

const ITEM_HORIZONTAL_PADDING = 6;

export const TabBar = <T extends Route>(
  props: SceneRendererProps & {
    navigationState: NavigationState<T>;
  },
) => {
  const { navigationState, position, jumpTo } = props;
  const { routes, index: focusedIndex } = navigationState;

  return (
    <View
      style={{
        borderBottomColor: Colors.background,
        flexDirection: 'row',
        paddingVertical: 12,
        paddingLeft: 16 - ITEM_HORIZONTAL_PADDING,
      }}>
      {routes.map((route, index) => {
        return (
          <TabItem
            focused={focusedIndex === index}
            route={route}
            onPress={() => {
              jumpTo(route.key);
            }}
            key={`${route.key}_${index}`}
          />
        );
      })}
    </View>
  );
};

const TabItem = React.memo(
  ({ focused, route, onPress }: { focused: boolean; route: Route; onPress: () => void }) => {
    // const anim = useRef(new Animated.Value(0)).current;
    const anim = useSharedValue(false);

    const textStyleAnim = useDerivedValue(() => {
      const value = !anim.value ? 0 : 1;
      return value * 5 + 16;
    });

    const { title = '', key } = route;

    const textStyle = useAnimatedStyle(() => {
      return {
        color: anim.value ? Colors.primary : Colors.text,
        fontSize: withTiming(textStyleAnim.value),
      };
    });

    const dotStyle = useAnimatedStyle(() => {
      return {
        height: 4,
        width: '100%',
        marginBottom: 4,
        borderRadius: 0,
        transform: [{ scale: withTiming(anim.value ? 1 : 0) }],
      };
    });

    useEffect(() => {
      anim.value = focused;
    }, [focused]);

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.tabItemContainer}>
          <Animated.View style={[styles.dot, dotStyle]} />
          {/* <_FeatureDiscoveryWrapper
            overlay={
              <Text
                style={[
                  Typography.h1,
                  {
                    alignItems: 'center',
                    color: focused ? Colors.primary : Colors.text,
                    fontSize: focused ? 21 : 16,
                  },
                ]}>
                {title}
              </Text>
            }
            featureId={key as FeatureIds}> */}
          <Animated.Text
            style={[
              Typography.h1,
              {
                alignItems: 'center',
              },
              textStyle,
            ]}>
            {title}
          </Animated.Text>
          {/* </_FeatureDiscoveryWrapper> */}
        </View>
      </TouchableWithoutFeedback>
    );
  },
);

const _FeatureDiscoveryWrapper = ({
  featureId,
  children,
  overlay,
}: {
  featureId: FeatureIds;
  children: JSX.Element;
  overlay: JSX.Element;
}) => {
  const isHomeScreenTab = featureId === 'following_feed'

  const featureDiscoveryMeta = useMemo(() => {
    let description = '';
    let title = '';
    let backgroundColor = '';
    switch (featureId) {
      case 'following_feed':
        description =
          "Theo dõi Kol's và bạn bè để xem những bài viết của họ thôi nhé!";
        title = 'Xem các bài viết của những người bạn đang theo dõi 😎';
        backgroundColor = Colors.blue;
        break;
      default:
        break;
    }
    return {
      description,
      title,
      backgroundColor,
    };
  }, [featureId]);

  if (isHomeScreenTab) {
    return (
      <FeatureMeasurement
        id={featureId as FeatureIds}
        {...featureDiscoveryMeta}
        overlay={
          <View style={styles.tabItemContainer}>
            {overlay}
          </View>
        }>
        {children}
      </FeatureMeasurement>
    );
  }

  return children;
};

// tslint:disable-next-line:no-any
const outputInterpolate = ({
  anim,
  dest,
  start,
}: {
  anim: Node<number>;
  dest: any;
  start: any;
}) => {
  return Animated.interpolateNode(anim, {
    inputRange: [0, 1],
    outputRange: [start, dest],
  });
};

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  tabItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ITEM_HORIZONTAL_PADDING,
    height: 28,
  },
});
