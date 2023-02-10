import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import DEPRECATED_InputField from 'components/inputs/InputField.v2';
import { isEmpty } from "lodash";
import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { sendEmailCode } from "services/api/auth/auth.api";
import { applyOpacity, Colors, Spacing, Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { useActions } from "utils/hooks/useActions";


export const InputEmailCode = ({
    title,
    buttonTitle,
    handleNextButton,
    message,
    email,
}: {
    title: string, email: string, buttonTitle: string, handleNextButton: (value: any) => void, message?: {
        status: string
    }
}) => {
    const [code, setCode] = useState('');
    const { setLoading } = useActions();

    const { inputField, titleText, errorText } = styles;

    const tokenError = useMemo(() => {
        if (message?.status === "notfound") {
            return "Mã xác thực không chính xác. Vui lòng kiểm tra lại!"
        }

        return ''
    }, [message?.status])

    const resend = async () => {
        try {
            setLoading(true);
            await sendEmailCode({ email });
        } catch (e) {
            /**/
        } finally {
            setLoading(false);
        }
    }
    return (

        <View style={{ flex: 1 }}>
            <View style={{ height: 12 }} />
            <Text style={titleText}>{title}</Text>
            <View style={{ height: 24 }} />
            <DEPRECATED_InputField
                // labelText="E-mail"
                textInputStyle={{ ...Typography.h1, textAlign: 'center' }}
                textColor={Colors.text}
                borderBottomColor={theme.PRIMARY_COLOR}
                inputType="text"
                customStyle={[inputField, (tokenError) ? { backgroundColor: applyOpacity(Colors.primary, 0.3) } : undefined]}
                onChangeText={(value: string) => setCode(value)}
                autoCapitalize={'none'}
                comment="Nhập mã tại đây"
                background={Colors.background}

            />
            {tokenError ? <Text style={errorText}>{tokenError}</Text> : undefined}
            <View style={{ height: 24 }} />
            {!isEmpty(tokenError) ? <Button
                text={'Gửi lại mã'}
                onPress={resend}
                type={ButtonType.flat}
                constraint={LayoutConstraint.wrapChild}
                textStyle={{ textTransform: 'none', color: Colors.surface.darkGray, textDecorationLine: 'underline' }}
                style={{ borderColor: Colors.line, marginBottom: 24, alignSelf: 'center' }}
            /> : undefined}
            <View style={{ flex: 1 }} />
            <View style={{ width: '100%', height: 48 }}>
                <Button
                    type={ButtonType.primary}
                    state={isEmpty(code) ? ButtonState.disabled : ButtonState.idle}
                    onPress={() => handleNextButton({ code })}
                    disabled={isEmpty(code)}
                    text={buttonTitle}
                />
            </View>
        </View>
    );
}

export default InputEmailCode;

const styles = StyleSheet.create({
    inputField: { marginBottom: 8 },
    titleText: {
        ...Typography.title,
    },
    nextButton: {
        paddingBottom: (40 - (14 - 8) / 2) * Spacing.AUTH_RATIO_H,
        backgroundColor: 'white',
        paddingTop: 12,
    },
    errorText: {
        ...Typography.description,
        color: Colors.primary,
        textAlign: 'right',
        marginRight: 12,
    },
});
