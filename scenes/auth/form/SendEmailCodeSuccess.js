import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, Typography } from 'styles';
import Ripple from 'react-native-material-ripple';
import { DabiFont } from 'assets/icons';


class SendEmailCodeSuccess extends Component {

    render() {
        const { email, title, buttonTitle, handleNextButton } = this.props
        const { titleText, content } = styles;
        return (
            <View style={{ flex: 1 }}>
                <View style={{ height: 12 }} />
                <Text style={titleText}>{title}</Text>
                <View style={{ height: 36 }} />
                <Text style={content}>{"Bạn chưa nhận được Mã xác thực?"}</Text>
                <View style={{ height: 8 }} />
                <Ripple onPress={() => handleNextButton({ isResend: true })}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                >
                    <Text style={Typography.name_button}>Gửi lại mã</Text>
                    <View style={{ width: 8 }} />
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' }}>
                        <DabiFont size={12} color={Colors.white} name={'small_arrow_right'} /></View>
                </Ripple>
                <View style={{ flex: 1 }} />
                <View style={{ width: '100%', height: 48 }}>
                    <Button
                        type={ButtonType.primary}
                        state={ButtonState.idle}
                        onPress={() => handleNextButton({ email })}
                        text={buttonTitle}
                    />

                </View>
            </View>
        );
    }
}

export default SendEmailCodeSuccess;

const styles = StyleSheet.create({
    titleText: {
        ...Typography.title,
        color: Colors.black,
    },
    content: {
        ...Typography.body,
        textAlign: 'right',
    },
    nextButton: {
        paddingBottom: (40 - (14 - 8) / 2) * Spacing.AUTH_RATIO_H,
        backgroundColor: 'white',
        paddingTop: 12,
    },
});
