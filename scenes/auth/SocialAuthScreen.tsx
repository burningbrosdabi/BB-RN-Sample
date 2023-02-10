import AsyncStorage from '@react-native-community/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DabiFont } from 'assets/icons';
import { toast } from 'components/alert/toast';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import { Link } from 'components/button/Link';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import { get } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { EmailLoginRouteSetting, RoutePath } from 'routes';
import { AppTourContext } from 'services/apptour/context';
import { JobType } from 'services/apptour/type';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { storeKey } from 'utils/constant';
import { HEADER_HEIGHT, unAwaited } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';


const SocialAuthScreen = () => {
    const [passAuth, setPassAuth] = useState(true);

    const navigator = useNavigator()
    const { token, isLoggedIn, isPassOnboarding } = useTypedSelector((state) => state.auth);
    const { message, type } = useTypedSelector((state) => state.alert);
    const { socialLogin, setLoading, clearMessage } = useActions();
    const navigation = useNavigation()
    const { showDialog } = useActions()
    const { jobs } = useContext(AppTourContext);

    useEffect(() => {
        setLoading(false);
        const checkAuth = async () => {
            const passAuth = (await AsyncStorage.getItem(storeKey.passAuth) == 'true') ? true : false
            jobs[JobType.onboarding].complete();
            setPassAuth(passAuth)
        }
        unAwaited(checkAuth())
        return () => {
            clearMessage()
        }
    }, []);

    useEffect(() => {
        if (message) {
            if (type === "success" || typeof message === 'string') {
                // showMessage({ message, type });
                toast(message)
            }
            setLoading(false);
        }

    }, [token, message, isLoggedIn]);

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

    const onBack = () => showDialog({
        title: 'Bạn không muốn đăng nhập?',
        description: `DABI sẽ mang đến những thông tin tuyệt vời chỉ dành riêng cho bạn!`,
        actions: [
            {
                text: 'Tiếp tục',
                type: ButtonType.primary,
                onPress: () => {
                },
            },
            {
                type: ButtonType.flat,
                text: 'Bỏ qua',
                onPress: async () => {
                    if (isPassOnboarding) {
                        navigation.goBack()
                        return
                    }
                    await AsyncStorage.setItem(storeKey.passAuth, 'true')
                    navigation.reset({
                        index: 0,
                        routes: [{ name: RoutePath.main }],
                    });
                },
                textStyle: { color: Colors.primary },

            },

        ],
    })
    return (
        <ConnectionDetection.View>
            <SafeAreaView style={{ backgroundColor: Colors.background }}>
                {passAuth ? <Header mode={'cancel'} onBack={onBack} /> : <View style={{ height: HEADER_HEIGHT }} />}
            </SafeAreaView>
            <View
                style={{
                    backgroundColor: Colors.background,
                    paddingHorizontal: 16,
                    flex: 1,
                }}>
                <Text
                    style={{
                        ...Typography.name,
                        color: Colors.black,
                        fontFamily: 'Chonburi-Regular',
                    }}>
                    {".Đăng nhập"}
                </Text>
                <View style={{ height: 36 }} />
                <Ripple onPress={() => { navigation.navigate(RoutePath.emailSignUp) }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <Text style={Typography.name_button}>Đăng ký bằng email</Text>
                    <View style={{ width: 8 }} />
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.black, alignItems: 'center', justifyContent: 'center' }}>
                        <DabiFont size={12} color={Colors.white} name={'small_arrow_right'} /></View>
                </Ripple>
            </View>
            <View style={{
                width: Spacing.screen.width,
                position: 'absolute',
                bottom: 0,
                paddingHorizontal: 16, backgroundColor: Colors.background
            }}>
                {!passAuth ? <Link text={'Xem không cần đăng ký'} onPress={onBack} /> : <></>}
                <View style={{ height: 24 }} />
                <Button
                    text={'Đăng nhập bằng Facebook'}
                    onPress={() => {
                        setLoading(true);
                        socialLogin('facebook');
                    }}
                    type={ButtonType.primary}
                    style={{
                        marginBottom: 24,
                        borderWidth: 0
                    }}
                    constraint={LayoutConstraint.matchParent}
                    prefixIcon={<Image style={{ width: 24, height: 24, marginRight: 12 }}
                        source={require('_assets/images/social/Facebook/Facebook_W.png')} />}
                />
                {Platform.OS === 'ios' ? <Button
                    text={'Đăng nhập bằng Apple'}
                    onPress={() => {
                        setLoading(true);
                        socialLogin('apple');
                    }}
                    style={{
                        marginBottom: 24,
                    }}
                    constraint={LayoutConstraint.matchParent}
                    prefixIcon={<Image style={{ width: 24, height: 24, marginRight: 12 }}
                        source={require('_assets/images/social/Apple/Apple_W.png')} />}
                /> : null}
                <Button
                    text={'Đăng nhập bằng email'}
                    textStyle={{ color: Colors.black }}
                    onPress={() => navigator.navigate(new EmailLoginRouteSetting())}
                    style={{
                        marginBottom: 24,
                        borderRadius: Outlines.borderRadius.button,
                        borderColor: Colors.black,
                        borderWidth: 1,
                    }}
                    color={'transparent'}
                    constraint={LayoutConstraint.matchParent}
                    prefixIcon={<View style={{ marginRight: 12 }}><DabiFont name={'mail'} /></View>}

                />
            </View>
            <SafeAreaView />
        </ConnectionDetection.View>
    );
};

export default SocialAuthScreen;
