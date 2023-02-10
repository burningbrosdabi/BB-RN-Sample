import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Colors, Typography } from 'styles';

export const FlashSaleTimmer = ({ end, textStyle, boxStyle, style }: {
  end?: Date,
  style?: ViewStyle,
  textStyle?: TextStyle, boxStyle?: ViewStyle
}) => {
  if (!end) return <></>;
  const [now, setNow] = useState(moment.utc());

  useEffect(() => {
    const interval = BackgroundTimer.setInterval(() => {
      setNow(moment.utc());
    }, 1000);
    return (() => {
      return BackgroundTimer.clearInterval(interval);
    })
  }, []);

  const { hour, min, sec } = useMemo(() => {
    const secs = moment.duration(moment.utc(end).diff(now)).asSeconds();

    const display2digit = (digit: number, zeroAt60?: boolean) => {
      const value = Math.max(digit, 0);
      if (zeroAt60 && value === 60) return `00`;
      if (value >= 10) return `${value}`;
      else return `0${value}`;
    };

    const hour = Math.floor(secs / (60 * 60));

    const divisor_for_minutes = secs % (60 * 60);
    const min = Math.floor(divisor_for_minutes / 60);

    const divisor_for_seconds = divisor_for_minutes % 60;
    const sec = Math.ceil(divisor_for_seconds);

    return {
      hour: display2digit(hour),
      min: display2digit(min, true),
      sec: display2digit(sec, true),
    };
  }, [now]);

  return (
    <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 16, ...style }}>
      <TimeBox value={hour} textStyle={textStyle} boxStyle={{ ...boxStyle, width: (parseInt(hour) > 999) ? 41 : 33 }} />
      <Semicolon />
      <TimeBox value={min} textStyle={textStyle} boxStyle={boxStyle} />
      <Semicolon />
      <TimeBox value={sec} textStyle={textStyle} boxStyle={boxStyle} />
    </View>
  );
};

const Semicolon = () => (
  <Text style={[Typography.name_button, { color: Colors.black, paddingHorizontal: 4 }]}>:</Text>
);

const TimeBox = ({ value, textStyle, boxStyle }: {
  value: string,
  textStyle?: TextStyle, boxStyle?: ViewStyle
}) => {
  return (
    <View
      style={{
        width: 33,
        height: 28,
        borderRadius: 4,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        ...boxStyle
      }}>
      <Text style={[Typography.name_button,
      { color: Colors.primary }, textStyle]}>{value}</Text>
    </View>
  );
};
