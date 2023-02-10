import { toast } from 'components/alert/toast';
import { ButtonType } from 'components/button/Button';

import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { isIPhoneX } from 'react-native-status-bar-height';
// utils
import { Colors } from 'styles';
import { useActions } from 'utils/hooks/useActions';
// Redux
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import InputEmailCode from './form/InputEmailCode';
import ResetPasswordForm from './form/ResetPasswordForm';
import SendEmailCode from './form/SendEmailCode';
import SendEmailCodeSuccess from './form/SendEmailCodeSuccess';
import { Header } from "components/header/Header";

const RESET_PASSWORD_STEP = [
    {
        title: 'Nhập Email bạn đã\nđăng ký tại Dabi',
        buttonTitle: 'NHẬN MÃ XÁC THỰC',
    },
    {
        title: 'Dabi đã gửi Mã xác thực đến Email của bạn. Vui lòng kiểm tra thông tin!',
        buttonTitle: 'NHẬP MÃ XÁC THỰC',
    },
    {
        title: 'Nhập Mã xác thực để\nĐặt lại mật khẩu',
        buttonTitle: 'ĐẶT LẠI MẬT KHẨU',
    },
    {
        title: 'Nhập mật khẩu mới',
        buttonTitle: 'HOÀN TẤT',
    },
];

const ResetPasswordScreen = ({ navigation }: { navigation: any }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [email, setEmail] = useState('');
    const [emailCode, setEmailCode] = useState('');

    const { message, type } = useTypedSelector(state => state.alert);
    const { setLoading, resetPassword, showDialog, sendEmailCode, validateToken, clearMessage } =
        useActions();
    const onBackUnSubscribe = useRef<() => void>(() => {
    });

    useEffect(() => {
        setLoading(false);
        onBackUnSubscribe.current = navigation.addListener('beforeRemove', (e: any) => {
            e.preventDefault();
            onBack();
        });

        return () => {
            clearMessage();
            onBackUnSubscribe.current();
        };
    }, []);

    useEffect(() => {
        if (message) {
            if (type == 'success') {
                // showMessage({ message, type });
                toast(message);
            }
            setLoading(false);
        }
    }, [message]);

    const handleNextButton = async (data: any) => {
        clearMessage();
        switch (currentPage) {
            case 0:
                setLoading(true);
                setEmail(data?.email);
                const result = await sendEmailCode({ email: data?.email });
                setLoading(false);
                if (result) {
                    setCurrentPage(currentPage + 1);
                }
                break;
            case 1:
                setLoading(true);
                if (data?.isResend) {
                    await sendEmailCode({ email });
                } else {
                    setCurrentPage(currentPage + 1);
                }
                setLoading(false);
                break;
            case 2:
                setLoading(true);
                if (data?.code) {
                    setEmailCode(data.code);
                    const result = await validateToken({ token: data.code });
                    if (result) {
                        setCurrentPage(currentPage + 1);
                    }
                }
                setLoading(false);
                break;
            case 3:
                if (data?.password) {
                    const param = {
                        password: data.password,
                        token: emailCode,
                    };

                    setLoading(true);
                    onBackUnSubscribe.current();
                    const result = await resetPassword(param);
                    setLoading(false);
                    if (result) {
                        navigation.navigate('EmailLogin');
                    }
                }
                break;
            default:
                return null;
        }
    };

    const onBack = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else {
            _renderExitAlert();
        }
    };

    const _renderExitAlert = () => {
        showDialog({
            title: 'Bạn không muốn Đặt lại mật khẩu?',
            actions: [
                {
                    type: ButtonType.primary,
                    text: 'ĐẶT LẠI MẬT KHẨU',
                    onPress: () => {
                    },
                },
                {
                    text: 'Thoát',
                    type: ButtonType.flat,
                    onPress: () => {
                        onBackUnSubscribe.current();
                        navigation.goBack();
                    },
                    textStyle: { color: Colors.primary },
                },
            ],
        });
    };

    const renderContent = () => {
        const item = RESET_PASSWORD_STEP[currentPage];
        switch (currentPage) {
            case 0:
                return (
                    <SendEmailCode
                        title={item.title}
                        buttonTitle={item.buttonTitle}
                        handleNextButton={handleNextButton}
                        message={message}
                    />
                );
            case 1:
                return (
                    <SendEmailCodeSuccess
                        title={item.title}
                        buttonTitle={item.buttonTitle}
                        email={email}
                        handleNextButton={handleNextButton}
                    />
                );
            case 2:
                return (
                    <InputEmailCode
                        title={item.title}
                        buttonTitle={item.buttonTitle}
                        email={email}
                        handleNextButton={handleNextButton}
                        message={message}
                    />
                );
            case 3:
                return (
                    <ResetPasswordForm
                        title={item.title}
                        buttonTitle={item.buttonTitle}
                        handleNextButton={handleNextButton}
                        message={message}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <Header />
            <View style={styles.container}>
                {renderContent()}
                {!isIPhoneX() && <View style={{ height: 12 }} />}
            </View>
        </SafeAreaView>
    );
};

export default ResetPasswordScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginHorizontal: 16,
        flex: 1,
    },
});
