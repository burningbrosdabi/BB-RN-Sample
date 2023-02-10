import React, { useState } from 'react';
import { Text, View, TouchableWithoutFeedback, TextStyle } from 'react-native';
import { Colors, Typography } from 'styles';
import { ButtonState } from './Button';
import { omit } from "lodash";

export const Link = ({
    disabled = false,
    text,
    onPress,
    style,
    focusColor = Colors.blue,
    blurColor = Colors.black,
    horizontalPadding = 12
}: {
    disabled?: boolean;
    text: string;
    onPress: () => void;
    style?: TextStyle | TextStyle[];
    focusColor?: string,
    blurColor?: string,
    horizontalPadding?: number,
}) => {
    const [buttonState, setButtonState] = useState(ButtonState.idle);

    const onPressIn = () => {
        setButtonState(ButtonState.focused);
    };
    const onPressOut = () => {
        setButtonState(ButtonState.idle);
        onPress();
    };

    return (
        <TouchableWithoutFeedback
            style={{ alignItems: 'center', justifyContent: 'center' }}
            disabled={disabled}
            onPressIn={onPressIn}
            onPressOut={onPressOut}>
            <View
                style={{
                    opacity: disabled ? 0.3 : 1,
                    alignItems: 'center',
                    paddingHorizontal: horizontalPadding
                }}>
                <Text
                    style={[
                        Typography.name_button,
                        {
                            textDecorationLine: 'underline',
                        },
                        style,
                        { color: buttonState === ButtonState.focused ? focusColor : blurColor, }
                    ]}>
                    {text}
                </Text>
            </View>
        </TouchableWithoutFeedback>
    );
};
