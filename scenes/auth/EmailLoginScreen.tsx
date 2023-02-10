import { useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
// utils
import { updateUserOnboardingData } from 'services/api';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import EmailLoginForm from './form/EmailLoginForm';
import { Header } from "components/header/Header";
import { Colors, Typography } from 'styles';
import BackButton from 'components/header/BackButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { RoutePath, RouteSetting } from 'routes';


export const EmailLoginScreen = () => {
    const { token, isLoggedIn, isPassOnboarding } = useTypedSelector((state) => state.auth);
    const { message, type } = useTypedSelector((state) => state.alert);
    const { setLoading, emailLogin, socialLogin, clearMessage } = useActions();
    const formRef = useRef(null)
    const navigation = useNavigation()

    useEffect(() => {
        setLoading(false);
        return () => {
            clearMessage()
        }
    }, []);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            formRef?.current?.resetState && formRef.current.resetState();
        })

        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (message) {
            if (type == "success") {
                // showMessage({ message, type });
                toast(message)
            }
            setLoading(false);
        }

    }, [token, message]);

    useEffect(() => {
        if (!isLoggedIn) return
        if (isLoggedIn && !isPassOnboarding) {
            navigation.navigate(RoutePath.heightAndWeight)
        }
        if (isLoggedIn && isPassOnboarding) {
            navigation.goBack();
        }
        setLoading(false);
    }, [isLoggedIn, isPassOnboarding])

    const handleNextButton = async ({ email, password }) => {
        setLoading(true);
        emailLogin({ email, password });
    };


    return (
        <ConnectionDetection.View>
            <SafeAreaView style={{ backgroundColor: Colors.background }}>
                <BackButton />
            </SafeAreaView>
            <View
                style={{
                    paddingTop: 20,
                    paddingHorizontal: 16,
                    paddingBottom: 12, backgroundColor: Colors.background
                }}>
                <Text
                    style={{
                        ...Typography.name,
                        color: Colors.black,
                        fontFamily: 'Chonburi-Regular',
                    }}>
                    {".Đăng nhập"}
                </Text>
            </View>

            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: Colors.background }}
                contentContainerStyle={{
                    paddingTop: 24,
                    paddingHorizontal: 16,
                    paddingBottom: 50
                }}
            >
                <EmailLoginForm
                    ref={formRef}
                    message={message}
                    setLoading={setLoading}
                    socialLogin={socialLogin}
                    navigation={navigation}
                    handleNextButton={handleNextButton} />
            </KeyboardAwareScrollView>
        </ConnectionDetection.View>
    );
};

export default EmailLoginScreen;