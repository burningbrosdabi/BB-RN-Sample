

import { Switch } from 'components/button/Switch';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { useSwitchNotification } from 'scenes/notification/UseNotiPermission';
import { unAwaited } from 'utils/helper';
import { Typography } from '_styles';

const NotificationSettingScreen = () => {
    const { switchValue, onSwitchValueChange, checkNotiPerm } = useSwitchNotification();
    useEffect(() => {
        unAwaited(checkNotiPerm());
    }, []);

    return (
        <ConnectionDetection.View>
            <SafeAreaView><Header title='Thông báo' /></SafeAreaView>
            <View style={{
                paddingVertical: 12,
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 48,
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}>
                    <Text style={Typography.name_button}>
                        {'Thông báo'}
                    </Text>
                    <Switch initialValue={switchValue} onChange={onSwitchValueChange} />
                </View>
            </View>
        </ConnectionDetection.View>
    );
}
    ;

export default NotificationSettingScreen;
