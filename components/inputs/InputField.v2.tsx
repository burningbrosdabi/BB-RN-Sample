import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { applyOpacity, Colors, Outlines, Typography } from 'styles';
import { isEmpty } from "lodash";

/** @deprecated */
export class DEPRECATED_InputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            secureInput: !(props.inputType === 'text' || props.inputType === 'email'),
        };
        this.toggleShowPassword = this.toggleShowPassword.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
    }


    toggleShowPassword() {
        this.setState({ secureInput: !this.state.secureInput });
    }

    onChangeText(text) {
        this.props.onChangeText(text);
        this.setState({ inputValue: text });
    }

    render() {
        const {
            labelText,
            labelTextSize,
            labelColor,
            textColor,
            inputType,
            customStyle,
            comment,
            editable,
            textInputStyle,
            errorMsg,
            onEndEditing,
            inputRef,
            labelStyle,
            errorStyle,
            maxLength,
            background
        } = this.props;
        const { secureInput, } = this.state;
        const fontSize = labelTextSize || 14;
        const color = labelColor || 'white';
        const inputColor = textColor || 'white';
        const keyboardType = this.props.keyboardType || (inputType === 'email' ? 'email-address' : 'default');
        const backgroundColor = background || Colors.white

        return (
            <View
                style={[styles.wrapper, customStyle]}>
                <View style={styles.labelContainer}>
                    {!isEmpty(labelText) &&
                        <Text style={[styles.supportComment, { color, fontSize }, labelStyle]}>{labelText}</Text>}
                    {!isEmpty(errorMsg) ?
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.errorText, errorStyle]}>{errorMsg}</Text></View> : undefined}
                </View>
                <View style={{
                    backgroundColor,
                    width: '100%', flexDirection: 'row', alignContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 28
                }}>
                    {
                        this.props.keyboardType === 'phone-pad' &&
                        <View style={{
                            justifyContent: "center",
                            marginRight: Platform.OS === 'ios' ? 4 : 0,
                        }}>
                            <Text
                                style={[Typography.body]}>+84</Text>
                        </View>
                    }
                    <TextInput
                        {...this.props}
                        ref={inputRef}
                        autoCorrect={false}
                        style={[styles.inputField, textInputStyle, { ...backgroundColor }]}
                        secureTextEntry={secureInput}
                        onChangeText={this.onChangeText}
                        keyboardType={keyboardType}
                        autoCorrect={false}
                        placeholder={comment}
                        placeholderTextColor={inputColor}
                        editable={editable}
                        onEndEditing={onEndEditing}
                        maxLength={maxLength}
                    />
                </View>
            </View>
        );
    }
}


export default DEPRECATED_InputField


const styles = StyleSheet.create({
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 8,
        // paddingVertical: 2,
        // marginBottom: Platform.OS == 'ios' ? 5 : 0,
    },
    supportComment: {
        ...Typography.name_button,
        textAlignVertical: 'bottom',
    },
    errorText: {
        ...Typography.description,
        color: Colors.red,
        textAlign: 'right',
    },
    wrapper: {
        minHeight: 60,
        borderRadius: Outlines.borderRadius.box,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputField: {
        ...Typography.body,
        lineHeight: 20,
        flex: 1,
        margin: 0,
        textAlignVertical: 'center',
        paddingVertical: 0,
        borderColor: 'green'
    },

    checkMarkWrapper: {
        position: 'absolute',
        right: 12,
        bottom: 22
    },
});


export interface InputBoxProps extends TextInputProps {
    text?: string;
    error?: string;
    minheight?: number;
    lineHeight?: number;
    initialValue?: string | number;
    inputTextStyle?: ViewStyle;
    containerStyle?: ViewStyle;
    inputType?: string
}


export const InputBox = (props: InputBoxProps) => {
    const { minheight, text, error,
        maxLength, lineHeight = 20, numberOfLines = 1, initialValue, inputTextStyle, containerStyle } = props
    return <View
        style={{
            minHeight: minheight,
            ...containerStyle
        }}>

        {text && <View style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 8
        }}>
            {text &&
                <Text style={{
                    ...Typography.name_button,
                    textAlignVertical: 'bottom',
                }}>{text}</Text>}
            <View style={{ marginLeft: 32, flex: 1 }}>
                {error ?
                    <Text style={{
                        ...Typography.smallCaption,
                        textTransform: 'none',
                        color: Colors.red,
                        textAlign: 'right',
                    }} >{error}</Text> : undefined}
            </View>
        </View>}

        <View style={{
            backgroundColor: Colors.background,
            width: '100%', flexDirection: 'row', alignContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 28
        }}>
            <TextInput
                style={{
                    ...Typography.body,
                    lineHeight: 20,
                    flex: 1,
                    margin: 0,
                    textAlignVertical: numberOfLines > 1 ? 'top' : 'center',
                    paddingVertical: 0,
                    flexWrap: 'wrap',
                    maxHeight: lineHeight * numberOfLines,
                    ...inputTextStyle
                }}
                autoCorrect={false}
                autoCapitalize='none'
                placeholderTextColor={Colors.text}
                multiline={numberOfLines > 1 ? true : false}
                maxLength={maxLength ?? undefined}
                value={initialValue}
                {...props}
            />
        </View>
    </View>

}

