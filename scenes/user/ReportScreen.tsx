import { useNavigation } from '@react-navigation/core';
import { toast } from 'components/alert/toast';
import Button, { ButtonState } from 'components/button/Button';
import IconButton from 'components/button/IconButton';
import React, { useState } from 'react'
import { View, Text, Linking } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import { Spacing, Typography } from 'styles';
import { postMessageToChannel } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Header as AppHeader } from "components/header/Header";
import DeviceInfo from "react-native-device-info";
import { remoteConfigService } from 'services/remote.config';


export const ReportInputScreen = () => {
    const { userInfo, } = useTypedSelector((state) => state.user);
    const navigation = useNavigation()
    const { id, name } = userInfo
    const [report, setReport] = useState('')

    const messengerLink = 'http://m.me/' + 'dabivietnam';
    const pageLink = 'https://www.facebook.com/' + '106467717966358';

    const onPressChat = () => {
        try {
            Linking.openURL(messengerLink);
        } catch {
            Linking.openURL(pageLink);
        }
    };

    const lines = Spacing.screen.height / 100
    return <View
        style={{ paddingHorizontal: 16 }}><View style={{
            flexDirection: 'row', width: '100%',
            paddingTop: 12, justifyContent: 'space-between'
        }}>
            <IconButton icon={'close'} onPress={() => navigation.goBack()} style={{ left: -4, top: -4 }} />
            <Text style={[Typography.subtitle]}>Phản hồi</Text>
            <IconButton icon={'send'} onPress={onPressChat} style={{ right: -4, top: -4 }} />
        </View>
        <View style={{
            height: 12 - 8
        }} />
        <TextInput
            placeholder={'Bạn ơi, hãy để lại phản hồi để giúp Dabi cải thiện ứng dụng tốt hơn nhé!'}
            numberOfLines={lines}
            multiline
            textAlignVertical={'top'}
            textAlign={'left'}
            onChangeText={setReport}
            style={{
                ...Typography.body, width: '100%',
                lineHeight: 21,
                height: lines * 21 // Typography.body lineheight = 21,
            }} />
        <View style={{ height: 12 }} />
        <View style={{ height: 48, width: '100%' }}>
            <Button
                state={report.length == 0 ? ButtonState.disabled : ButtonState.idle}
                onPress={() => {
                    postMessageToChannel({
                        message: `User id :${id}(${name}) - Feedback\nWhere:${navigation.getState().routes.map((item) => { return " >" + item.name })}\n v ${DeviceInfo.getVersion()} - ${remoteConfigService().getHomeLayout()
                            }\n ${report}`,
                        channel: 'general_feedbacks'
                    })
                    toast("Cám ơn những ý kiến đóng góp của bạn. Dabi sẽ cải thiện ứng dụng tốt hơn dựa vào đó!")
                    navigation.goBack()
                }}
                text={'Gửi'} />
        </View>
        <Text
            style={[Typography.smallCaption, { textAlign: 'right', marginTop: 4 }]}>{`v ${DeviceInfo.getVersion()} - ${remoteConfigService().getHomeLayout()
                }`}</Text>
    </View>

}