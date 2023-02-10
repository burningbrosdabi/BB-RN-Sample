import DabiFont from 'assets/icons/dabi.fonts';
import { ButtonState } from "./Button";
import { isEmpty, isNil } from 'lodash';
import React from 'react';
import { ActivityIndicator, Animated, Image, ImageRequireSource, Text, View, ViewStyle } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Observable } from 'rxjs';
import { Colors } from 'styles';
import { Badge } from './badge/Badge';

type BadgeProps = {
    observer: Observable<boolean>;
    offset: { top: number; right: number };
};

export const DEFAULT_IC_BTN_PADDING = 4; // (icon - iconSize) / 2

export const IconButton = ({
    size = 32,
    iconSize,
    onPress = () => {
    },
    icon,
    badge,
    onLayout,
    animatedColor,
    color = Colors.black,
    source,
    state = ButtonState.idle,
    backgroundColor = 'transparent',
    style
}: {
    size?: number;
    iconSize?: number;
    onPress?: () => void;
    icon?: string;
    badge?: BadgeProps;
    onLayout?: () => void;
    animatedColor?: Animated.AnimatedInterpolation;
    color?: string;
    source?: ImageRequireSource,
    state?: ButtonState,
    backgroundColor?: string,
    style?: ViewStyle
}) => {
    const icSize = iconSize ?? size - 8;
    const icColor = state === ButtonState.disabled
        ? Colors.button
        : !isEmpty(color)
            ? color
            : Colors.icon;
    const disabled = state === ButtonState.disabled || state === ButtonState.loading

    const renderChild = () => {
        if (state === ButtonState.loading) {
            return <View style={{ width: icSize, height: icSize }}>
                <ActivityIndicator size={'small'} color={icColor} />
            </View>
        }

        return !isNil(icon)
            ? <DabiFont
                animatedColor={animatedColor}
                name={icon ?? ''}
                color={icColor}
                size={icSize}
            />
            : !isNil(source) &&
            <Image source={source} style={{ width: icSize, height: icSize, resizeMode: 'contain' }} />

    }


    return (
        <Ripple
            onLayout={onLayout}
            disabled={disabled}
            onPress={onPress}
            rippleContainerBorderRadius={size / 2}
            style={[{
                width: size,
                height: size,
                alignItems: 'center',
                backgroundColor,
                justifyContent: 'center',
                borderRadius: size / 2,
            }, style]}>
            {renderChild()}
            {badge && <Badge observer={badge.observer} offset={badge.offset} />}
        </Ripple>
    );
};

export default IconButton