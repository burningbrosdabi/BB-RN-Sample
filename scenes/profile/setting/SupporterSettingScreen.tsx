

import { toast } from 'components/alert/toast';
import { Switch } from 'components/button/Switch';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import { UserType } from 'model/user/user';
import React, { useEffect, useState } from 'react';
import { Text, View, Linking, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import { useSwitchNotification } from 'scenes/notification/UseNotiPermission';
import { postMessageToChannel, unAwaited } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { applyFakeOpacity, Colors, Outlines, Typography } from '_styles';
import { Http } from 'services/http/http.service';
import { HandledError } from 'error';
import Button, { ButtonType, LayoutConstraint } from 'components/button/Button';
import { InputBox } from 'components/inputs/InputField.v2';
import { isNil } from 'lodash';


const child = () => {
    const { userInfo, } = useTypedSelector((state) => state.user);
    const { profile_image, id, name, email, description, insta_id, user_type, weight, height } = userInfo;

    const [supporterVisible, setSupporterVisible] = useState<boolean>(false);
    const [supporterCode, setSupporterCode] = useState<string>('');
    const [supporterCodeError, setSupporterCodeError] = useState<string>('');

    const { switchValue, onSwitchValueChange, checkNotiPerm } = useSwitchNotification();
    useEffect(() => {
        unAwaited(checkNotiPerm());
    }, []);

    const {
        setLoading,
        setUserInfo,
    } = useActions();

    const _onVerifySupporter = async () => {
        try {

            setLoading(true)
            const url = `v1/supporters/verify/`;
            let formData = new FormData();
            formData.append('code', supporterCode.toUpperCase());
            const response = await Http.instance.post(url, formData);
            if (response.data.detail == "ACCEPTED") {
                setUserInfo({ ...userInfo, user_type: UserType.SUPPORTER })
                toast('Hoàn thành kích hoạt tài khoản hỗ trợ.')
                postMessageToChannel({
                    message: `User id :${id}(${name} / ${email}) - Complete to register in supporter program`,
                    channel: 'general_supporters'
                })
            }
            setLoading(false)
            return response.data;
        } catch (error) {
            const exception = new HandledError({
                error: error as Error,
                stack: 'user.api.onVerifySupporter',
            });
            setSupporterCodeError('Mã kích hoạt không chính xác')
            setLoading(false)
            throw exception;
        }

    }


    if (user_type == 'SUPPORTER') {
        return <View><View style={{ backgroundColor: Colors.background, padding: 16, borderRadius: 8 }}>
            <Text style={Typography.name_button}>
                Đã kích hoạt tài khoản hỗ trợ ( id : {id} )
            </Text>
        </View>
            <Ripple onPress={async () => {
                const openDeeplink = await Linking.canOpenURL('https://www.facebook.com/groups/450256923268920')
                if (openDeeplink) {
                    Linking.openURL('https://www.facebook.com/groups/450256923268920')
                } else {
                    toast('Error on opening supporter group.')
                    postMessageToChannel({ message: 'Error on opening supporter group link', channel: 'general_supporters' })
                }
            }
            }><View style={{
                paddingTop: 8
            }}>
                    <Text style={{ ...Typography.mark, color: Colors.red, textDecorationLine: 'underline', textAlign: 'right' }}>
                        Tham gia nhóm Facebook để hoàn thành đăng ký nha!</Text>
                </View>
            </Ripple>
        </View>
    }



    return (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
            <InputBox
                initialValue={supporterCode} placeholder={'Nhập mã tại đây'} maxLength={30}
                onChangeText={setSupporterCode} />
            {!isNil(supporterCodeError) &&
                <View style={{ paddingTop: 8, alignItems: 'flex-end' }}><Text style={{ ...Typography.description, color: Colors.red }}>{supporterCodeError}</Text></View>}
        </View>

        <View style={{ width: 12 }} />
        <Button type={ButtonType.flat}

            text={'Đăng ký'} constraint={LayoutConstraint.wrapChild} onPress={_onVerifySupporter}
            style={{ height: 44 }} />
    </View>
    );
}


const SupporterSettingScreen = () => {

    return <ConnectionDetection.View>
        <SafeAreaView><Header title={'Quản lý tài khoản hỗ trợ'} /></SafeAreaView>
        <View style={{ paddingTop: 12, paddingHorizontal: 16 }}>
            <Text style={Typography.body}>Để đăng ký chương trình hỗ trợ, hãy nhập mã hỗ trợ mà bạn có vào ô dưới nhé!</Text>
            <View style={{ height: 24 }} />
            {child()}
        </View>
    </ConnectionDetection.View >
}
export default SupporterSettingScreen;
