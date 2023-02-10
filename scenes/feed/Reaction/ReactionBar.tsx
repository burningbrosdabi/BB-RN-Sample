import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { ReactionContext } from 'scenes/feed/Reaction/context';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { DabiFont } from '_icons';
import { Colors } from 'styles';
import { slice } from 'lodash';
import { createCommentApi } from '_api';
import { CommentItemModel, CommentType } from 'model';
import { Subject } from 'rxjs';
import { CommentContext } from 'components/comment/context';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { useActions } from 'utils/hooks/useActions';
import { AuthDialog } from 'components/alert/dialog';

enum ReactionBarState {
  minimized,
  expanded,
}

export const ReactionBar = ({ pk }: { pk: number }) => {
  const { setEmoji } = useContext(ReactionContext);
  const [state, setState] = useState(ReactionBarState.minimized);
  const timmer = useRef<ReturnType<typeof setTimeout>>(null);

  const { commentStream } = useContext(CommentContext);

  const _0ref = useRef();
  const _1ref = useRef();
  const _2ref = useRef();
  const _3ref = useRef();
  const _4ref = useRef();
  const _5ref = useRef();

  const emojies = useMemo(() => {
    return ['💖', '😍', '🤣', '😯', '💯', '😥'];
  }, []);

  const layoutRefs = [_0ref, _1ref, _2ref, _3ref, _4ref, _5ref];

  const isLogined = useTypedSelector(state => state.auth.isLoggedIn);

  const { showDialog } = useActions();

  const onSelectEmoji = (index: number) => {
    if (state === ReactionBarState.minimized) {
      requestExpand();
      return;
    }
    if (timmer.current) {
      clearTimeout(timmer.current);
    }
    // @ts-expect-error
    layoutRefs[index].current?.measureInWindow((x, y, width, height) => {
      setEmoji({
        renderBox: { x, y, width, height },
        emoji: emojies[index],
      });
      setTimeout(() => setState(ReactionBarState.minimized), 200);
    });

    createCommentApi(pk, { message: emojies[index] }, CommentType.feed).then(value => {
      commentStream?.next(value);
    });
  };

  const { containerStyle, emojiContainerStyle } = useAnimation({ state });

  const requestExpand = () => {
    if (!isLogined) {
      showDialog(AuthDialog);
      return;
    }
    if (state === ReactionBarState.minimized) {
      setState(ReactionBarState.expanded);

      timmer.current = setTimeout(() => {
        setState(ReactionBarState.minimized);
      }, 2500);

      return;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={requestExpand}>
      <Animated.View style={[styles.container, containerStyle]}>
        {state === ReactionBarState.minimized && (
          <View style={{ marginRight: 4, width: 12, height: 12 }}>
            <DabiFont color={Colors.primary} size={12} name={'small_add_2'} />
          </View>
        )}
        <TouchableWithoutFeedback
          onPress={() => {
            onSelectEmoji(0);
          }}>
          <View
            ref={layoutRefs[0]}
            style={{ width: 24, height: 24, marginRight: 12}}>
            <Text style={{ fontSize: 20, color: 'white', lineHeight: 24 }}>{emojies[0]}</Text>
          </View>
        </TouchableWithoutFeedback>
        <Animated.View style={[emojiContainerStyle, { flexDirection: 'row' }]}>
          {slice(emojies, 1).map((emoji, _index) => {
            const index = _index + 1;
            if (state === ReactionBarState.minimized) return <></>;
            return (
              <TouchableWithoutFeedback
                onPress={() => {
                  onSelectEmoji(index);
                }}
                key={`${emoji}-${index}`}>
                <Animated.View
                  ref={layoutRefs[index]}
                  style={[{ width: 24, height: 24, marginRight: 12 }]}>
                  <Text style={{ fontSize: 20, color: 'white', lineHeight: 24 }}>{emoji}</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            );
          })}
        </Animated.View>
        <View style={{ width: 12 }} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const useAnimation = ({ state }: { state: ReactionBarState }) => {
  const mounted = useRef(false);
  const animController = useSharedValue(0);

  const containerSize = useDerivedValue(() => {
    return animController.value * 168 + 64;
  });

  const emojiContainerOpacity = useDerivedValue(() => {
    return animController.value;
  });

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (state === ReactionBarState.minimized) {
      animController.value = withTiming(0);
    } else {
      animController.value = withTiming(1);
    }
  }, [state]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      width: containerSize.value,
    };
  });

  const emojiContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(emojiContainerOpacity.value, { duration: 160 }),
    };
  });

  return {
    containerStyle,
    emojiContainerStyle,
  };
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.primary,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
  },
});
