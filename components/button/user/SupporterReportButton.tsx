import { useNavigation } from '@react-navigation/native'
import { DabiFont } from 'assets/icons'
import { toast } from 'components/alert/toast'
import React, { useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import codePush from "react-native-code-push"
import Ripple from 'react-native-material-ripple'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import RNUxcam from 'react-native-ux-cam'
import { RoutePath } from 'routes'
import { useNavigator } from 'services/navigation/navigation.service'
import { Colors, Spacing, Typography } from 'styles'
import { isProduction, postMessageToChannel, secondsToMinute, timeout } from 'utils/helper'
import { useActions } from 'utils/hooks/useActions'
import { useTypedSelector } from 'utils/hooks/useTypedSelector'
import { ButtonType } from '../Button'


export const SupporterReportButton = () => {
    const { userInfo, } = useTypedSelector((state) => state.user);
    const { id, name, user_type } = userInfo;
    const {
        showDialog,
    } = useActions();
    const navigation = useNavigation()
    const [testing, setTesting] = useState(false)
    const [progressValue, setProgressValue] = useState(0);
    const { setLoading } = useActions()
    useEffect(() => {
        if (testing) {
            const interval = setInterval(() =>
                setProgressValue(progressValue + 1),
                1000
            );
            return () => clearInterval(interval);
        }
    }, [testing, progressValue]);

    const _toggleTest = () => {
        // Need to add trigger on setting page
        if (testing == true) {
            showDialog({
                title: 'Bạn có chắc chắn đã hoàn thành nhiệm vụ hôm nay?',
                description: `Vui lòng xác nhận lại xem bạn có bỏ lỡ nhiệm vụ nào không nhé! ( id : ${id} )`,
                actions: [
                    {
                        type: ButtonType.primary,
                        text: 'Có',
                        onPress: () => {
                            if (isProduction()) {
                                RNUxcam.stopSessionAndUploadData()
                                postMessageToChannel({
                                    message: `User id :${id}(${name}) - Finish testing ${secondsToMinute(progressValue)}`,
                                    channel: 'general_supporters'
                                })
                            }
                            toast('Hoàn thành kiểm thử! Cám ơn sự giúp đỡ của bạn')
                            setTesting(false)
                            setProgressValue(0)
                        },
                    },
                    {
                        text: 'Chưa xong',
                        type: ButtonType.flat,
                        onPress: () => {

                        },
                        textStyle: { color: Colors.primary },
                    },
                ],
            }
            )
        } else {
            showDialog({
                title: 'Bắt đầu kiểm tra ngay?',
                description: `Vui lòng xác nhận nhiệm vụ hàng ngày trước khi bắt đầu ( id : ${id} )`,
                actions: [
                    {
                        text: 'Bắt đầu',
                        type: ButtonType.primary,
                        onPress: () => {
                            if (isProduction()) {
                                RNUxcam.enableAdvancedGestureRecognizers(false);
                                if (Platform.OS == 'ios') {
                                    RNUxcam.optIntoSchematicRecordings();
                                }
                                RNUxcam.startWithKey('2y8fcdakdfryqos');
                                postMessageToChannel({ message: `User id :${id}(${name}) - Start testing`, channel: 'general_supporters' })
                            }
                            toast('Bắt đầu thử nghiệm. \nHãy nhấn nút hoàn thành khi kết thúc quá trình kiểm tra.')
                            setTesting(true)
                        },
                    },
                    {
                        type: ButtonType.flat,
                        text: 'Không phải bây giờ',
                        onPress: () => {

                        },
                        textStyle: { color: Colors.primary },

                    },

                ],
            }
            )

        }
    }

    const _onReport = () => {
        navigation.navigate(RoutePath.report)
    }

    const _syncUpdate = async () => {
        setLoading(true)
        const syncStatus = await timeout(async () => await codePush.sync({
            installMode: codePush.InstallMode.IMMEDIATE,
        }), 10000, () => {
            setLoading(false);
            return codePush.SyncStatus.UNKNOWN_ERROR
        })
        setLoading(false)
        switch (syncStatus) {
            case codePush.SyncStatus.UP_TO_DATE:
                toast('Không có bản cập nhật nào')
                break
            case codePush.SyncStatus.UNKNOWN_ERROR:
                toast('Lỗi')
                break
            default:
                codePush.allowRestart()
                codePush.restartApp()
        }
    }

    if (user_type != 'SUPPORTER') {
        return <></>
    }

    return <View style={{
        position: 'absolute',
        right: 0,
        top: Spacing.screen.height / 2 - 48,
        backgroundColor: Colors.white,
        width: 36,
        paddingVertical: 12,
    }}>

        <Ripple
            style={{
                flex: 1,
                alignItems: 'center', justifyContent: 'center'
            }} onPress={_syncUpdate}>

            <DabiFont size={12}
                color={Colors.black}
                name={'sync'} />

        </Ripple>
        <View style={{ height: 24 }}></View>
        <Ripple style={{
            flex: 1,
            alignItems: 'center', justifyContent: 'center',
        }}
            onPress={_toggleTest}>
            <DabiFont name={testing ? 'stop' : 'play'}
                size={12}
                color={testing ? Colors.blue : Colors.warn} />
            {testing && <Text style={{
                ...Typography.smallCaption,
            }}>{secondsToMinute(progressValue)}</Text>}
        </Ripple>
        <View style={{ height: 24 }}></View>
        <Ripple
            style={{
                flex: 1,
                alignItems: 'center', justifyContent: 'center'
            }} onPress={_onReport}>

            <DabiFont
                size={12}
                color={Colors.black}
                name={'edit'} />
        </Ripple>

    </View>
}