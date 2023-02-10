import { DabiFont, SalesIcon } from 'assets/icons';
import KMarkIcon from 'assets/icons/store/KMarkIcon';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Typography } from 'styles';

interface FeedbackDecoratorProps {
  containerStyle?: ViewStyle;
  isShowText?: boolean;
}

const Feedback = (props: FeedbackDecoratorProps): JSX.Element => {
  const { isShowText = true, containerStyle } = props;
  return (
    <_Decorator
      gradient={Colors.gradient.pink}
      containerStyle={containerStyle}>
      {isShowText && (
        <Text style={[Typography.description, { color: Colors.white, marginRight: 4 }]}>
          Kol's Feedback
        </Text>
      )}
      <View style={styles.iconStyle}>{<DabiFont name={'crown'} size={12} color={Colors.red} />}</View>
    </_Decorator>
  );
};

const KBrand = (props: FeedbackDecoratorProps): JSX.Element => {
  const { isShowText = true, containerStyle } = props;
  return (
    <_Decorator gradient={Colors.gradient.yellow} containerStyle={containerStyle}>
      <KMarkIcon />
      {isShowText && (
        <Text style={[styles.feedbackDecoratorText, { color: Colors.primary, marginLeft: 4 }]}>
          K-brand
        </Text>
      )}
    </_Decorator>
  );
};

const Sale = (props: FeedbackDecoratorProps): JSX.Element => {
  const { isShowText = true, containerStyle } = props;
  return (
    <_Decorator gradient={Colors.gradient.pink} containerStyle={containerStyle}>
      <SalesIcon />
      {isShowText && (
        <Text style={[styles.feedbackDecoratorText, { marginLeft: 4 }]}>
          Sale
        </Text>
      )}
    </_Decorator>
  );
};

export const _Decorator = ({
  containerStyle,
  children,
  gradient,
}: FeedbackDecoratorProps & {
  children: JSX.Element | JSX.Element[] | (false | Element);
  gradient: string[];
}): JSX.Element => {
  return (
    <LinearGradient
      colors={gradient}
      useAngle
      angle={271}
      style={[styles.feedbackDecoratorContainer, containerStyle]}>
      {children}
    </LinearGradient>
  );
};

export const Decorator = {
  Feedback,
  KBrand,
  Sale
};

const styles = StyleSheet.create({
  feedbackDecoratorContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderWidth: 0,
  },
  feedbackDecoratorText: {
    ...Typography.description,
    color: Colors.white,
    alignItems: 'baseline',
    textAlignVertical: 'bottom',
    height: 16,
  },
  iconStyle: {
    marginHorizontal: 0,
    height: 16,

    justifyContent: 'center',
  },
});
