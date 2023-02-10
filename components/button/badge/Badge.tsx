import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Observable, Subscription } from 'rxjs';
import { Colors } from 'styles';

const notiDotSize = 6;
type Offset = { top: number; right: number };

export const Badge = ({ observer, offset }: { observer: Observable<boolean>; offset?: Offset }) => {
  const _scale = React.useMemo(() => new Animated.Value(0), []);
  const subsription = useRef<Subscription | null>();

  useEffect(() => {
    // tslint:disable-next-line: deprecation
    subsription.current = observer.subscribe((value) => {
      // if (isNil(value)) return;

      const animations = [
        Animated.timing(_scale, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ];
      if (value) {
        animations.push(
          Animated.spring(_scale, {
            toValue: 1,
            // duration: 150,
            bounciness: 24,
            useNativeDriver: true,
          }),
        );
      }
      Animated.sequence(animations).start();
    });

    return () => {
      subsription.current?.unsubscribe();
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.notiDot,
        offset,
        {
          transform: [
            {
              scale: _scale,
            },
          ],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  notiDot: {
    backgroundColor: Colors.red,
    width: notiDotSize,
    height: notiDotSize,
    borderRadius: notiDotSize / 2,
    position: 'absolute',
    top: 4,
    right: 4,
  },
});
