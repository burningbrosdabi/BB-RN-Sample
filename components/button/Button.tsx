import DabiFont from 'assets/icons/dabi.fonts';
import { debounce } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlexAlignType, Text, TextStyle, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ripple from 'react-native-material-ripple';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { applyOpacity, applyFakeOpacity, Colors, Outlines, Typography } from 'styles';

export interface ButtonProps {
  onPress: () => void;
  disabled?: boolean;
  text?: string;
  type?: ButtonType;
  children?: Element;
  state?: ButtonState;
  constraint?: LayoutConstraint;
  alignItems?: FlexAlignType;
  color?: string[] | string;
  textStyle?: TextStyle;
  prefixIcon?: Element;
  postfixIcon?: string;
  postfixText?: string;
  postfixTextStyle?: TextStyle;
  childContainerStyle?: ViewStyle;
  iconColor?: string;
  innerHorizontalPadding?: number;
  key?: string;
  style?: ViewStyle | ViewStyle[];
  testID?: string;
  indicatorColor?: string;
}

export const Button = (props: ButtonProps) => {
  const {
    testID,
    onPress: pressed,
    text,
    type = ButtonType.primary,
    state = ButtonState.idle,
    constraint,
    alignItems,
    color,
    prefixIcon,
    postfixIcon,
    postfixText,
    postfixTextStyle,
    childContainerStyle,
    textStyle,
    iconColor,
    innerHorizontalPadding,
    style,
    disabled = false,
    indicatorColor,
  } = props;

  const builder = useMemo<ButtonBuilder>(() => {
    let builder: OptionButtonBuilder;
    switch (type) {
      case ButtonType.option:
        builder = new OptionButtonBuilder();
        break;
      case ButtonType.outlined:
        builder = new OutlineButtonBuilder();
        break;
      case ButtonType.flat:
        builder = new FlatButtonBuilder();
        break;
      case ButtonType.primary:
      default:
        builder = new PrimaryButtonBuilder();
    }
    builder.copyWith({
      state: state ?? ButtonState.idle,
      constraint: constraint ?? LayoutConstraint.matchParent,
      text,
      alignItems: alignItems ?? 'center',
      prefixIcon,
      postfixIcon,
      postfixText,
      postfixTextStyle,
      childContainerStyle,
      textStyle,
      color: color instanceof Array ? 'transparent' : color ?? Colors.black,
      iconColor,
      innerHorizontalPadding,
      indicatorColor
    });

    return builder;
  }, [props]);

  const onPress = () => {
    /** TODO: add tracking */
    pressed();
  };

  const innerContainer = (child: Element): Element => {
    if (color instanceof Array) {
      return (
        <LinearGradient
          colors={color}
          end={{ x: 0, y: 0.7 }}
          start={{ x: 1, y: 0.7 }}
          style={[builder.innerContainerLayout, builder.decoration, { flex: 1 }]}>
          {child}
        </LinearGradient>
      );
    }

    return (
      <View style={[builder.innerContainerLayout, builder.decoration, { flex: 1 }]}>{child}</View>
    );
  };

  const _onPress = useCallback(debounce(onPress, 200, { leading: true, trailing: false }), [
    onPress,
  ]);

  return (
    // @ts-expect-error
    <Ripple
      testID={testID}
      rippleOpacity={type === ButtonType.outlined || type === ButtonType.flat ? 0.15 : undefined}
      style={[builder.dimension, style]}
      rippleContainerBorderRadius={builder.decoration.borderRadius}
      onPress={_onPress}
      disabled={state === ButtonState.disabled || state === ButtonState.loading || disabled}>
      {innerContainer(builder.child)}
    </Ripple>
  );
};

export enum LayoutConstraint {
  matchParent,
  wrapChild,
}

export enum ButtonType {
  outlined = 'outlined',
  primary = 'primary',
  option = 'option',
  gradient = 'gradient',
  flat = 'gradient',
}

export enum ButtonState {
  idle,
  disabled,
  focused,
  loading,
}

interface DecorationPreset {
  borderWidth: number;
  borderColor: string;
  backgroundColor: string;
  borderRadius: number;
}

abstract class ButtonBuilder {
  constraint?: LayoutConstraint;

  disabled = false;
  state = ButtonState.idle;
  color = Colors.primary;
  text?= '';
  alignItems?: FlexAlignType = 'center';
  prefixIcon?: Element;
  postfixIcon?: string;
  postfixText?: string;
  postfixTextStyle?: TextStyle;
  childContainerStyle?: ViewStyle;
  _textStyle: TextStyle = {};
  iconColor?: string = Colors.icon;
  innerHorizontalPadding?: number;
  indicatorColor?: string;

  copyWith(props?: {
    constraint?: LayoutConstraint;
    text?: string;
    color?: string;
    state?: ButtonState;
    prefixIcon?: Element;
    postfixIcon?: string;
    postfixText?: string;
    postfixTextStyle?: TextStyle;
    childContainerStyle?: ViewStyle;
    alignItems?: FlexAlignType;
    textStyle?: TextStyle;
    iconColor?: string;
    innerHorizontalPadding?: number;
    indicatorColor?: string
  }) {
    const {
      constraint,
      color,
      state,
      text = '',
      prefixIcon,
      postfixIcon,
      postfixText,
      postfixTextStyle,
      childContainerStyle,
      alignItems,
      textStyle,
      iconColor,
      innerHorizontalPadding,
      indicatorColor
    } = props ?? {};
    this.constraint = constraint ?? LayoutConstraint.matchParent;
    this.color = color ?? Colors.primary;
    this.state = state ?? ButtonState.idle;
    this.text = text;
    this.prefixIcon = prefixIcon;
    this.postfixIcon = postfixIcon;
    this.postfixText = postfixText;
    this.postfixTextStyle = postfixTextStyle;
    this.childContainerStyle = childContainerStyle;
    this.alignItems = alignItems ?? 'center';
    this.textStyle = textStyle ?? {};
    this.iconColor = iconColor ?? Colors.icon;
    this.innerHorizontalPadding = innerHorizontalPadding ?? 12;
    this.indicatorColor = indicatorColor;
  }

  get typo(): TextStyle {
    switch (this.constraint) {
      case LayoutConstraint.matchParent:
        return { ...Typography.name_button, textTransform: 'uppercase' };
        break;
      case LayoutConstraint.wrapChild:
      default:
        return { ...Typography.name_button };
    }
  }

  abstract get textColor(): string;

  set textStyle(value: TextStyle) {
    if (!value) return;
    this._textStyle = value;
  }

  get textStyle(): TextStyle {
    return {
      ...this.typo,
      color: this.textColor,
      ...this._textStyle,
    };
  }

  get dimension(): ViewStyle {
    const dimension: ViewStyle = {};
    switch (this.constraint) {
      case LayoutConstraint.wrapChild:
        dimension.height = 28;
        dimension.alignSelf = 'baseline';
        break;
      case LayoutConstraint.matchParent:
      default:
        dimension.minHeight = 48;
        dimension.flex = 1;
    }

    return dimension;
  }

  get innerContainerLayout(): ViewStyle {
    return {
      paddingHorizontal: this.innerHorizontalPadding,
      alignItems: this.alignItems,
      justifyContent: 'center',
    };
  }

  abstract get decoration(): DecorationPreset;
  get child(): Element {
    switch (this.state) {
      case ButtonState.loading:
        return <ActivityIndicator color={this.indicatorColor ?? this.textColor} />;
      default:
        return (
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
              this.childContainerStyle,
            ]}>
            {this.prefixIcon ? this.prefixIcon : undefined}

            <Text
              numberOfLines={this.constraint === LayoutConstraint.matchParent ? 2 : 1}
              style={[
                this.textStyle,
                {
                  ...(this.alignItems !== 'center' ? { width: '60%' } : undefined),
                },
              ]}>
              {this.text}
            </Text>
            {this.postfixIcon && (
              <>
                <View
                  style={[
                    this.alignItems !== 'center' ? { flex: 1 } : { alignItems: 'center', width: 4 },
                    { flexDirection: 'row' },
                  ]}
                />
                <Text
                  style={[
                    Typography.description,
                    { color: this.iconColor, marginRight: 4 },
                    this.postfixTextStyle,
                  ]}>
                  {this.postfixText}
                </Text>
                <DabiFont
                  name={this.postfixIcon}
                  size={this.textStyle.fontSize! - 2}
                  color={this.iconColor}
                />
              </>
            )}
          </View>
        );
    }
  }
}

class PrimaryButtonBuilder extends ButtonBuilder {
  get textColor(): string {
    return Colors.white;
  }

  get decoration(): DecorationPreset {
    const preset: DecorationPreset = {
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: this.color,
      borderRadius: Outlines.borderRadius.button,
    };
    if (this.state === ButtonState.loading || this.state === ButtonState.disabled) {
      preset.backgroundColor = applyFakeOpacity(Colors.primary, 0.3);
    }

    return preset;
  }
}

class OutlineButtonBuilder extends ButtonBuilder {
  get textColor(): string {
    if (this.state === ButtonState.disabled || this.state === ButtonState.loading) {
      return Colors.text;
    } else return this.color;
  }

  get decoration(): DecorationPreset {
    const preset: DecorationPreset = {
      borderWidth: 1,
      borderColor: this.color,
      backgroundColor: 'transparent',
      borderRadius: Outlines.borderRadius.button,
    };
    if (this.state === ButtonState.loading || this.state === ButtonState.disabled) {
      preset.borderColor = Colors.icon;
    }

    return preset;
  }
}
class FlatButtonBuilder extends ButtonBuilder {
  get textColor(): string {
    if (this.state === ButtonState.disabled || this.state === ButtonState.loading) {
      return Colors.background;
    }

    return Colors.black;
  }

  get decoration(): DecorationPreset {
    const preset: DecorationPreset = {
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      borderRadius: Outlines.borderRadius.button,
    };

    return preset;
  }
}

class OptionButtonBuilder extends ButtonBuilder {
  get textColor(): string {
    if (this.state === ButtonState.focused) return Colors.primary;

    return Colors.text;
  }

  get decoration(): DecorationPreset {
    const preset: DecorationPreset = {
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: Colors.background,
      borderRadius: Outlines.borderRadius.button,
    };

    if (this.state === ButtonState.focused) {
      preset.backgroundColor = applyOpacity(Colors.primary, 0.3);
    }

    return preset;
  }
}

export const floatingButtonContainer = (): { style: ViewStyle, height: number } => {
  const insets = useSafeAreaInsets();

  return {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingTop: 12,
      paddingHorizontal: 16,
      paddingBottom: Math.max(insets.bottom, 12),
      backgroundColor: Colors.white
    }, height: Math.max(insets.bottom, 12) + 48 + 12
  }
}

export default Button;
export type { ButtonProps };