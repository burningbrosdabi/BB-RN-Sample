import MemoCheckMarkIcon from 'assets/icons/CheckMarkIcon';
import { PropTypes } from 'prop-types';
import React, { PureComponent } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Outlines, Typography } from '_styles';
import theme from '_styles/legacy/theme.style';


export class RadioCircleButton extends PureComponent {
  static defaultProps = {
    inactiveColor: theme.LIGHT_GRAY,
    activeColor: theme.PRIMARY_COLOR,
    selected: false,
    onPress: () => { },
    radius: 40,
  };

  constructor(props) {
    super(props);
    this.state = {
      isClicked: this.props.selected,
    };
    this.select = this.select.bind(this);
    this._renderCheckBox = this._renderCheckBox.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (props.selected !== state.isClicked) {
      return {
        isClicked: props.selected,
      };
    }
    return null;
  }

  select() {
    this.setState({ isClicked: !this.state.isClicked }, () => {
      this.props.onPress();
    });
  }

  _renderCheckBox(colorCheck) {
    const { radius, nonIconChecked } = this.props;
    if (nonIconChecked) {
      return <View style={{
        width: radius - 8,
        height: radius - 8,
        borderRadius: (radius - 8) / 2,
        backgroundColor: Colors.primary
      }} />;
    }

    return <MemoCheckMarkIcon color={colorCheck ? Colors.surface.midGray : Colors.white} />;
  }
  render() {
    const { _renderCheckBox } = this;
    const { isClicked } = this.state;
    const { checkBoxContainer } = styles;
    const { color, onPress, buttonStyle, radius, border, colorCheck, label, icon, image, containerStyle, labelStyle, disabled } = this.props;
    const backgroundColor = color || 'transparent';
    const circleStyle = {
      width: radius,
      height: radius,
      borderRadius: radius / 2,
    };
    return (
      <View style={[{ alignItems: 'center', justifyContent: 'center', opacity: disabled ? 0.4 : 1, }, containerStyle]}>
        <TouchableOpacity
          disabled={disabled}
          style={[
            circleStyle,
            {
              backgroundColor,
              borderWidth: border ? Outlines.borderWidth.base : 0,
              borderColor: Colors.boxLine, //DBDDDE
            },
            buttonStyle,
          ]}
          onPress={() => {
            onPress;
            this.select();
          }}>
          {this.props.children}
          {icon ? <View style={{ position: 'absolute' }}>{icon}</View> : null}
          {image ? (
            <Image
              source={image}
              style={[
                {
                  position: 'absolute',
                },
                circleStyle,
              ]}
            />
          ) : null}
          {isClicked && (
            <View
              style={[
                checkBoxContainer,
                circleStyle,
                (icon || image) && {
                  backgroundColor: theme.TRANSPARENT_BLACK_3,
                },
              ]}>
              {_renderCheckBox(colorCheck)}
            </View>
          )}
        </TouchableOpacity>
        {label && (
          <View style={{ marginTop: 4, alignItems: 'center' }}>
            <Text
              style={[{ ...Typography.description, textAlign: 'center', }, labelStyle]}>
              {label}
            </Text>
          </View>
        )}
      </View>
    );
  }
}

RadioCircleButton.propTypes = {
  radius: PropTypes.number,
  onPress: PropTypes.func,
  buttonStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  checkBoxContainer: { alignItems: 'center', justifyContent: 'center' },
});
