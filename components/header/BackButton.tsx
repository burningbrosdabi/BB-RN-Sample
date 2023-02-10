import { useNavigation } from '@react-navigation/core';
import { ButtonState } from 'components/button/Button';
import { IconButton } from "components/button/IconButton";
import React from 'react';
import { View, ViewStyle } from 'react-native';

interface Props {
    mode?: string
    color?: string
    leftPadding?: number
    containerStyle?: ViewStyle
    handleOnPress?: () => void
    disabled?: boolean
}

const BackButton = (props: Props) => {
    const navigation = useNavigation();
    return (
        <View style={{ paddingLeft: props.leftPadding ?? 8, paddingRight: 12, ...props.containerStyle }}>
            <IconButton
                icon={(props.mode == "cancel") ? 'close' : 'arrow_left'}
                state={props.disabled && ButtonState.disabled}
                color={props.color}
                onPress={
                    props.handleOnPress
                        ? props.handleOnPress
                        : () => {
                            navigation.goBack();
                        }
                } />
        </View>
    );
};

export default BackButton;
