import { useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { ConnectionDetection } from 'components/empty/OfflineView';
import BackButton from 'components/header/BackButton';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RoutePath } from 'routes';
import { Colors, Typography } from 'styles';
import { useActions } from 'utils/hooks/useActions';
// Redux
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import EmailSignUpForm from './form/EmailSignUpForm';


export const EmailSignUpScreen = () => {
    const { token, isLoggedIn, isPassOnboarding } = useTypedSelector(state => state.auth);
    const { message, type } = useTypedSelector(state => state.alert);
    const { setLoading, socialLogin, emailSignUp, clearMessage } = useActions();
    const navigation = useNavigation();

    useEffect(() => {
        setLoading(false);
        return () => {
            clearMessage();
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
    }, [token, message]);

    useEffect(() => {
        console.log(isLoggedIn, isPassOnboarding, 'status')
        if (!isLoggedIn) return
        if (isLoggedIn && !isPassOnboarding) {
            navigation.navigate(RoutePath.heightAndWeight)
        }
        if (isLoggedIn && isPassOnboarding) {
            navigation.goBack();
        }
        setLoading(false);
    }, [isLoggedIn, isPassOnboarding])

    const handleNextButton = async ({ email, name, password }) => {
        setLoading(true);
        emailSignUp({ email, name, password });
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
                    {".Đăng ký"}
                </Text>
            </View>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                style={{ backgroundColor: Colors.background }}
                contentContainerStyle={{
                    marginTop: 24,
                    paddingHorizontal: 16,
                    paddingBottom: 50
                }}
            >
                <EmailSignUpForm
                    message={message}
                    handleNextButton={handleNextButton}
                    setLoading={setLoading}
                    socialLogin={socialLogin}
                    navigation={navigation}
                />
            </KeyboardAwareScrollView>
        </ConnectionDetection.View>
    );
};

export default EmailSignUpScreen;
