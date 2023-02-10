

import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import React from 'react';
import { Linking, SafeAreaView, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Typography } from '_styles';

const TermsAndConditionsScreen = () => {

    return (
        <ConnectionDetection.View>
            <SafeAreaView><Header title='Điều kiện và điều khoản sử dụng' /></SafeAreaView>
            <Ripple onPress={() => { Linking.openURL('mailto:su.seo@burningb.com') }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 48,
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}>
                    <Text style={Typography.name_button}>
                        {'Hỗ trợ'}
                    </Text>
                </View>
            </Ripple>
            <Ripple onPress={() => { Linking.openURL('https://dabivn.com/privacy-policy/') }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 48,
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}>
                    <Text style={Typography.name_button}>
                        {'Chính sách thông tin cá nhân'}
                    </Text>
                </View>
            </Ripple>
            <Ripple onPress={() => { Linking.openURL('https://dabivn.com/term-of-service/') }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    height: 48,
                    alignItems: 'center',
                    paddingHorizontal: 16,
                }}>
                    <Text style={Typography.name_button}>
                        {'Điều khoản dịch vụ'}
                    </Text>
                </View>
            </Ripple>
        </ConnectionDetection.View>
    );
}
    ;

export default TermsAndConditionsScreen;
