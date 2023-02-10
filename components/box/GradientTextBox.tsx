import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { PlaceholderMedia } from 'rn-placeholder';
import { Colors, Typography } from 'styles';

interface GradientTextBoxProps {
  containerStyle?: any;
  isShowText?: boolean;
  text?: string;
  left?: boolean;
  color?: string;
  icon?: any;
}

export const GradientTextBox = ({ containerStyle, text, left, color, icon }: GradientTextBoxProps): JSX.Element => {
  let colors;
  switch (color) {
    case 'blue':
      colors = Colors.gradient.blue
      break
    case 'green':
      colors = Colors.gradient.green
      break
    case 'purple':
      colors = Colors.gradient.purple
      break
    case 'yellow':
      colors = Colors.gradient.yellow
      break
    default:
      colors = Colors.gradient.pink
  }
  return (
    <LinearGradient
      colors={colors}
      useAngle
      angle={271}
      style={[styles.GradientTextBoxContainer, containerStyle]}>
      {icon && left && <View style={[styles.iconStyle, { marginRight: 4 }]}>
        {icon && icon}
      </View>}
      {text &&
        <Text style={styles.GradientTextBoxText}>
          {text}
        </Text>
      }
      {icon && !left &&
        <View style={[styles.iconStyle, { marginLeft: 4 }]}>
          {icon && icon}
        </View>}
    </LinearGradient>
  );
};

export const GradientTextBoxPlaceHolder = () => {
  return <PlaceholderMedia
    style={{
      width: 64,
      height: 24,
      borderTopRightRadius: 12,
      borderTopLeftRadius: 12,
      backgroundColor: 'white',
    }}
  />
}

const styles = StyleSheet.create({
  GradientTextBoxContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center'
  },
  GradientTextBoxText: {
    ...Typography.description,
    color: Colors.white,
  },
  iconStyle: {
    marginHorizontal: 0,
  }
});
export default GradientTextBox;
