import { toast } from 'components/alert/toast';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import IconButton from 'components/button/IconButton';
import { Switch } from 'components/button/Switch';
import { ConnectionDetection } from 'components/empty/OfflineView';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { RoutePath } from 'routes';
import { PhoneVerifyRouteSetting } from 'routes/verify/verifyPhone.route';
import { useSwitchNotification } from 'scenes/notification/UseNotiPermission';
import { getRecipientList } from 'services/api';
import { useNavigator } from 'services/navigation/navigation.service';
import { fontRegular } from 'styles/typography';
import { ageList, cityList } from 'utils/data';
import { unAwaited } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useGetProvinces } from 'utils/hooks/useGetProvinces';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Colors, Spacing, Typography } from '_styles';
import RecipientItem from './recipients/RecipientItem';
import SettingMenu from './SettingMenu';
import { Header } from "components/header/Header";
import DeviceInfo from "react-native-device-info";
import { remoteConfigService } from "services/remote.config";


const Legacy_SettingScreen = ({ navigation }: { navigation: any }) => {
    const { token } = useTypedSelector((state) => state.auth);
    const { userInfo, recipients } = useTypedSelector((state) => state.user);
    const { message, type } = useTypedSelector((state) => state.alert);
    const { name, is_require_fb_connect, age, region, phone_number, profile_image, id } = userInfo;

    const ageValue = age ? ageList.find((res) => res.key == age) : ageList[0];
    const regionValue = region ? cityList.find((res) => res.id == region) : cityList[0];

    const {
        setLoading,
        showDialog,
        logout,
        setRecipients,
        socialLogin,
        clearMessage,
        setUserInfo,
    } = useActions();
    const { switchValue, onSwitchValueChange, checkNotiPerm } = useSwitchNotification();
    useGetProvinces();

    useEffect(() => {
        unAwaited(checkNotiPerm());
        onGetRecipients();

        return () => {
            clearMessage();
        };
    }, []);

    useEffect(() => {
        if (message) {
            if (type == 'success' || typeof message === 'string') {
                toast(message);
            }
            setLoading(false);
        }
    }, [message]);

    // get recipient list
    const onGetRecipients = async () => {
        try {
            setLoading(true);
            const result = await getRecipientList({ offset: 0 });
            setLoading(false);
            setRecipients(result.data);
        } catch (error) {
            setLoading(false);
            showDialog({
                title: error.friendlyMessage,
                actions: [
                    {
                        type: ButtonType.primary,
                        text: 'Ok',
                        onPress: () => {
                        },
                    },
                ],
            });
        }
    };


    const onCreateEditRecipient = () => {
        navigation.push(RoutePath.createEditRecipientScreen, { data: {}, isEditing: false });
    };

    const onAgeSelection = () => {
        navigation.push(RoutePath.ageSelectionScreen, { ageIndex: ageValue?.id });
    };

    const onCitySelection = () => {
        navigation.push(RoutePath.citySelectionScreen, { regionIndex: regionValue?.index });
    };

    const onEditRecipientList = () => {
        navigation.push(RoutePath.recipientListScreen);
    };

    const onLogout = () => {
        logout();
        navigation.goBack();
    };


    const onConnectAccount = () => {
        setLoading(true);
        socialLogin('facebook', token);
    };

    const navigator = useNavigator();

    const verifyPhone = () => {
        navigator.navigate(
            new PhoneVerifyRouteSetting({
                onSuccess: (phone) => {
                    const newUser = {
                        ...userInfo,
                        phone_number: phone,
                    };
                    setUserInfo(newUser);
                },
            }),
        );
    };

    return (
        <SafeAreaView style={styles.screenContainer}>
            <Header title={'Cài đặt'} />
            <View style={styles.screenContainer}>
                <ScrollView
                    style={[
                        styles.screenContainer,
                        { marginBottom: is_require_fb_connect ? 16 * 2 + 24 : 0 },
                    ]}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}>
                    <ConnectionDetection.View>
                        <View style={styles.screenContainer}>
                            <View style={styles.personalInformationContainer}>
                                <Button
                                    innerHorizontalPadding={16}
                                    text={ageValue?.description || '19-24'}
                                    color={Colors.button}
                                    type={ButtonType.flat}
                                    textStyle={{ ...Typography.name_button, color: Colors.black }}
                                    style={{ alignItems: 'flex-start' }}
                                    onPress={onAgeSelection}
                                    iconColor={Colors.icon}
                                    postfixIcon={'small_arrow_right'}
                                />
                                <Button
                                    innerHorizontalPadding={16}
                                    text={regionValue?.description || 'Hồ Chí Minh'}
                                    color={Colors.button}
                                    type={ButtonType.flat}
                                    textStyle={{ ...Typography.name_button, color: Colors.black }}
                                    onPress={onCitySelection}
                                    style={{ alignItems: 'flex-start' }}
                                    iconColor={Colors.icon}
                                    postfixIcon={'small_arrow_right'}
                                />
                                <View style={styles.authenticationBox}>
                                    <Text
                                        style={{
                                            ...Typography.name_button,
                                            color: phone_number ? Colors.black : Colors.text,
                                            textTransform: 'none',
                                        }}>
                                        {phone_number ? phone_number : 'Số điện thoại'}
                                    </Text>
                                    <Ripple disabled={!!phone_number} onPress={verifyPhone}
                                        style={[styles.authPhoneButton, { backgroundColor: phone_number ? Colors.white : Colors.primary }]}>
                                        <Text
                                            style={{
                                                ...Typography.option,
                                                color: phone_number ? Colors.primary : Colors.white,
                                                textTransform: 'none'
                                            }}>
                                            {phone_number ? 'Đã xác thực' : 'Xác thực +'}
                                        </Text>
                                    </Ripple>
                                </View>
                            </View>
                            <View style={styles.addressContainer}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}>
                                    <Text
                                        style={{
                                            ...Typography.name_button,
                                            color: Colors.black,
                                            textTransform: 'none',
                                            paddingVertical: 12,
                                        }}>
                                        {'Địa chỉ của bạn'}
                                    </Text>
                                    {recipients?.length > 0 && (
                                        <IconButton
                                            icon={'edit'}
                                            onPress={onEditRecipientList}
                                        />
                                    )}
                                </View>
                                {recipients?.length > 0 ? (
                                    <RecipientItem canEdit={false} data={recipients[0]} />
                                ) : (
                                    <Ripple onPress={onCreateEditRecipient} style={styles.newAddressButton}>
                                        <Text
                                            style={{ ...Typography.option, color: Colors.text, textTransform: 'none' }}>
                                            {'THÊM ĐỊA CHỈ MỚI +'}
                                        </Text>
                                    </Ripple>
                                )}
                            </View>
                            <View style={styles.notificationContainer}>
                                <View style={styles.notificationBox}>
                                    <Text style={{ ...Typography.name_button, color: Colors.black, textTransform: 'none' }}>
                                        {'Thông báo'}
                                    </Text>
                                    <Switch initialValue={switchValue} onChange={onSwitchValueChange} />
                                </View>
                            </View>
                            <SettingMenu />
                            <View>
                                <Button
                                    innerHorizontalPadding={16}
                                    text={'Đăng xuất'}
                                    type={ButtonType.flat}
                                    color={Colors.black}
                                    textStyle={{ ...Typography.name_button, color: Colors.text, textTransform: 'none' }}
                                    style={{
                                        marginVertical: 8
                                    }}
                                    onPress={onLogout}
                                    constraint={LayoutConstraint.wrapChild}
                                />

                            </View>
                            <Text
                                style={[Typography.smallCaption, { paddingLeft: 16 }]}>{`v ${DeviceInfo.getVersion()}`}</Text>
                            <View style={{ height: 24 }} />
                        </View>
                    </ConnectionDetection.View>
                </ScrollView>
                {is_require_fb_connect && (
                    <View style={styles.warningContainer}>
                        <Text style={styles.warningText}>
                            {
                                'Liên kết tài khoản với Facebook để Dabi có thể gợi ý phong cách phù hợp với bạn nhé!'
                            }
                        </Text>
                        <Ripple onPress={onConnectAccount} style={styles.verifyButton}>
                            <Text style={{ ...Typography.option, color: Colors.white, textTransform: 'none' }}>
                                {'Liên kết'}
                            </Text>
                        </Ripple>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default Legacy_SettingScreen;

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    personalInformationContainer: {
        paddingVertical: 12,
        borderBottomWidth: 4,
        borderColor: Colors.background,
    },
    authenticationBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 48,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    notificationContainer: {
        paddingVertical: 12,
        borderBottomWidth: 4,
        borderColor: Colors.background,
    },
    notificationBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 48,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    nameText: {
        ...Typography.h1,
        marginRight: 6.5,
        textTransform: 'none',
    },
    emailText: {
        ...Typography.name_button,
        textTransform: 'none',
    },
    authPhoneButton: {
        height: 28,
        paddingHorizontal: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.primary,
        justifyContent: 'center',
    },
    addressContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 4,
        borderColor: Colors.background,
    },
    newAddressButton: {
        height: 48,
        width: Spacing.screen.width - 32,
        borderRadius: 4,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.background,
        marginBottom: 12,
    },
    warningView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 10.5,
        height: 9,
        resizeMode: 'contain',
        marginRight: 4,
    },
    warningContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(253, 118, 148, 0.3)',
    },
    verifyButton: {
        height: 28,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
    },
    warningText: {
        ...Typography.description,
        fontFamily: fontRegular,
        color: Colors.primary,
        textTransform: 'none',
        width: '75%',
    },
    semiCicleTopContainer: {
        overflow: 'hidden',
        width: 80,
        height: 40,
        position: 'absolute',
        bottom: 0,
        borderBottomLeftRadius: 80,
        borderBottomRightRadius: 80,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    semiCicle: {
        position: 'absolute',
        bottom: 12,
        width: 22,
        height: 22,
        resizeMode: 'contain',
        tintColor: 'white'
    },
});
