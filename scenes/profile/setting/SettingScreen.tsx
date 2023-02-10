

import { DabiFont } from 'assets/icons';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from "components/header/Header";
import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import DeviceInfo from "react-native-device-info";
import Ripple from 'react-native-material-ripple';
import { notificationSettingRouteSetting, profileUpdateRouteSetting, RoutePath, socialSettingRouteSetting, supporterSettingRouteSetting, termsAndConditionsRouteSetting } from 'routes';
import HeightAndWeightScreen from 'scenes/onboarding/HeightAndWeightScreen';
import { NavigationService } from 'services/navigation';
import { useActions } from 'utils/hooks/useActions';
import { Colors, Typography } from '_styles';


const _IconLineButton = ({ title, icon, onPress }: { title: string, icon: string, onPress: () => void }) => {

    return <View style={{ paddingLeft: 16, height: 48 }}>
        <Ripple onPress={onPress} style={{
            flexDirection: 'row', alignItems: 'center',
        }}>
            <DabiFont name={icon} />
            <View style={{ width: 8 }} />
            <Text style={Typography.name_button}>{title}</Text>
        </Ripple>
    </View>
}

const SettingScreen = ({ navigation }: { navigation: any }) => {

    const {
        logout,
    } = useActions();

    const onLogout = () => {
        logout();
        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header title={'Thay đổi'} />
            <View style={{ flex: 1, paddingTop: 12 }}>
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}>
                    <ConnectionDetection.View>
                        <_IconLineButton title={'Cài đặt thông tin cá nhân'} icon={'setting'} onPress={() => NavigationService.instance.navigate(new profileUpdateRouteSetting())} />
                        <_IconLineButton title={'Liên kết mạng xã hội'} icon={'link'} onPress={() => NavigationService.instance.navigate(new socialSettingRouteSetting())} />
                        <_IconLineButton title={'Thông báo'} icon={'noti_line'} onPress={() => NavigationService.instance.navigate(new notificationSettingRouteSetting())} />
                        <_IconLineButton title={'Điều kiện và điều khoản sử dụng'} icon={'policy'} onPress={() => NavigationService.instance.navigate(new termsAndConditionsRouteSetting())} />
                        <_IconLineButton title={'Quản lý tài khoản hỗ trợ'} icon={'my_line'} onPress={() => NavigationService.instance.navigate(new supporterSettingRouteSetting())} />
                        {/* <_IconLineButton title={'Onboarding test'} icon={'my_line'} onPress={() => navigation.navigate(RoutePath.auth, { screen: RoutePath.styleSelection })} /> */}
                        <Button
                            innerHorizontalPadding={12}
                            text={'Đăng xuất'}
                            type={ButtonType.flat}
                            color={Colors.black}
                            textStyle={{ ...Typography.description, color: Colors.text, textTransform: 'none' }}
                            onPress={onLogout}
                            constraint={LayoutConstraint.wrapChild}
                        />
                        <Text
                            style={[Typography.smallCaption, { paddingLeft: 16, marginTop: 8 }]}>{`v ${DeviceInfo.getVersion()}`}</Text>

                    </ConnectionDetection.View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default SettingScreen;
