import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Text } from 'react-native';
import { Colors, Typography } from 'styles';
import { useAppStateObserve } from 'utils/hooks/useAppStateObserve';

export enum CountdownState {
  idle,
  running,
  stop,
}

export const CountdownDescription = forwardRef(
  (
    {
      onChangeState,
    }: {
      onChangeState: (state: CountdownState) => void;
    },
    ref,
  ) => {
    const duration = 60000;
    const [tick, setTick] = useState(duration);
    const bgTime = useRef<number | null>(null);
    const _interval = useRef<ReturnType<typeof setInterval> | null>(null);
    const offset = useRef<number>(0);

    const start = useCallback(() => {
      if (tick !== duration) {
        setTick(duration);
        onChangeState(CountdownState.running);
      }

      const interval = setInterval(() => {
        setTick((lastTick) => {
          if (lastTick <= 0) {
            clearInterval(interval);
          }

          return Math.max(lastTick - 1000 - offset.current, 0);
        });
      }, 1000);

      return interval;
    }, [tick]);

    useImperativeHandle(ref, () => ({
      start,
    }));

    useEffect(() => {
      if (tick <= 0) {
        onChangeState(CountdownState.stop);
      }
      if (offset.current !== 0) {
        offset.current = 0;
      }
    }, [tick]);

    const onActive = () => {
      if (_interval.current) clearInterval(_interval.current);
      let _offset = 0;
      if (bgTime.current) {
        _offset = Math.max(Date.now() - bgTime.current, 0);
      }

      offset.current = _offset;
      const interval = start();
      _interval.current = interval;

      return Promise.resolve();
    };

    const onBackground = useCallback(() => {
      // console.log('onBG');
      // setBgTime(Date.now());
      bgTime.current = Date.now();
      return Promise.resolve();
    }, []);

    useAppStateObserve({
      onActive,
      onBackground,
    });

    const [min, sec] = useMemo(() => {
      const display2digit = (value: number) => {
        if (value >= 10) return `${value}`;
        else return `0${value}`;
      };
      const min = display2digit(Math.max(Math.floor(tick / 60000), 0));
      const _tick = tick % 60000 === 0 ? 0 : tick;
      const sec = display2digit(Math.max(Math.round(_tick / 1000), 0));

      return [min, sec];
    }, [tick]);

    useEffect(() => {
      const interval = start();
      _interval.current = interval;

      return () => {
        if (_interval.current) clearInterval(_interval.current);
      };
    }, []);

    return (
      <Text
        style={[
          Typography.name_button,
          { textAlign: 'center', color: Colors.primary },
        ]}>{`Nhập lại mã OTP sau ${min}:${sec}`}</Text>
    );
  },
);
