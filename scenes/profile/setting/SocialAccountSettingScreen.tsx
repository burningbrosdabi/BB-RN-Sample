

import { useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType, floatingButtonContainer } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import { InputBox } from 'components/inputs/InputField.v2';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import { HandledError } from "error";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updateUserApi } from 'services/api';
import { validURL } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Colors, Typography } from '_styles';
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";

const SocialAccountSettingScreen = () => {
    const { userInfo, } = useTypedSelector((state) => state.user);
    const { name, description, insta_id, facebook_id, tiktok_id, youtube_id, etc_id } = userInfo;

    const [userInstagram, setUserInstagram] = useState<string | undefined>(insta_id)
    const [instagramError, setInstagramError] = useState<string | undefined>(undefined)

    const [userFacebook, setUserFacebook] = useState<string | undefined>(facebook_id)
    const [facebookError, setFacebookError] = useState<string | undefined>(undefined)
    const [userTiktok, setUserTiktok] = useState<string | undefined>(tiktok_id)
    const [tiktokError, setTiktokError] = useState<string | undefined>(undefined)

    const [userYoutube, setUserYoutube] = useState<string | undefined>(youtube_id)
    const [youtueError, setYoutueError] = useState<string | undefined>(undefined)
    const [userETCUrl, setUserETCUrl] = useState<string | undefined>(etc_id)
    const [homepageError, setHomepageError] = useState<string | undefined>(undefined)


    const {
        setLoading,
        showDialog,
        setUserInfo,
    } = useActions();
    const navigation = useNavigation()

    const backSubscription = useRef(() => {
    })

    const onSave = useCallback(async () => {
        if (userFacebook && !validURL(userFacebook)) {
            toast('Xin hãy điền địa chỉ theo đúng định dạng.')
            setFacebookError('Xin hãy điền địa chỉ theo đúng định dạng.')
            return
        }
        if (userYoutube && !validURL(userYoutube)) {
            toast('Xin hãy điền địa chỉ theo đúng định dạng.')
            setYoutueError('Xin hãy điền địa chỉ theo đúng định dạng.')
            return
        }
        if (userETCUrl && !validURL(userETCUrl)) {
            toast('Xin hãy điền địa chỉ theo đúng định dạng.')
            setHomepageError('Xin hãy điền địa chỉ theo đúng định dạng.')
            return
        }
        setFacebookError(undefined)
        try {
            setLoading(true)
            console.log(userFacebook)
            const userInfo = await updateUserApi({
                insta_id: userInstagram == "" ? null : userInstagram,
                facebook_id: userFacebook == "" ? null : userFacebook,
                tiktok_id: userTiktok == "" ? null : userTiktok,
                youtube_id: userYoutube == "" ? null : userYoutube,
                etc_id: userETCUrl == "" ? null : userETCUrl,
            })
            Keyboard.dismiss();
            setUserInfo(userInfo);
            // feedStream.next(); // reload feedback list in profile
            toast('Thông tin tài khoản đã được cập nhật!')
            backSubscription.current();
            navigation.goBack()
        } catch (e) {
            const error = new HandledError({
                error: e as Error,
                stack: 'SocialAccountSetting.onSave'
            });
            toast(error.friendlyMessage)
        }
        finally {
            setLoading(false)

        }

    }, [userInstagram, userFacebook, userTiktok, userYoutube, userETCUrl,])


    const _onConfirm = useCallback(async () => {
        let newInstagram = insta_id !== userInstagram ? (userInstagram?.toString() || null) : undefined
        if (!insta_id && !userInstagram) newInstagram = undefined;
        let newFacebook = facebook_id !== userFacebook ? (userFacebook?.toString() || null) : undefined
        if (!facebook_id && !userFacebook) newFacebook = undefined;
        let newTiktok = tiktok_id !== userTiktok ? (userTiktok?.toString() || null) : undefined
        if (!tiktok_id && !userTiktok) newTiktok = undefined;
        let newYoutube = youtube_id !== userYoutube ? (userYoutube?.toString() || null) : undefined
        if (!youtube_id && !userYoutube) newYoutube = undefined;
        let newETCUrl = etc_id !== userETCUrl ? (userETCUrl?.toString() || null) : undefined
        if (!etc_id && !userETCUrl) newETCUrl = undefined;

        if (newInstagram !== undefined || newFacebook !== undefined || newTiktok !== undefined || newYoutube !== undefined || newETCUrl !== undefined) {
            showDialog({
                title: 'Bạn có muốn lưu thông tin đã thay đổi không?',
                actions: [
                    {
                        type: ButtonType.primary,
                        text: 'Hủy bỏ',
                        onPress: () => {
                            backSubscription.current();
                            navigation.goBack()
                        },
                    },
                    {
                        text: 'Tiếp tục',
                        onPress: () => {
                        },
                        type: ButtonType.flat,
                    },
                ],
            });

        } else {
            backSubscription.current();
            navigation.goBack()
        }
    }, [userInstagram, userFacebook, userTiktok, userYoutube, userETCUrl,])

    useEffect(() => {
        backSubscription.current();
        backSubscription.current = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            _onConfirm();
        });
    }, [userInstagram, userFacebook, userTiktok, userYoutube, userETCUrl,])
    const _renderItem = () => {

        return <View style={{ ...styles.rowContainer, borderWidth: 1 }}>
            <Text style={Typography.title}>Instagram</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12 }}>
                <Text style={Typography.name_button}>www.instagram.com</Text>
                <Text style={{ ...Typography.name_button, marginHorizontal: 8 }}>/</Text>
                <View style={{ flex: 1, bottom: 3 }}>
                    <InputBox initialValue={userInstagram} placeholder={'Nhập ID'} maxLength={30}
                        onChangeText={setUserInstagram} />
                </View>
            </View>
            <Text style={{ ...Typography.description, color: Colors.red, textAlign: 'right', paddingTop: 8 }}>{instagramError ?? ''}</Text>

        </View>

    }

    type Item = {
        key: string;
        label: string;
        height: number;
        width: number;
        backgroundColor: string;
    };

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        { backgroundColor: isActive ? "red" : item.backgroundColor },
                    ]}
                >
                    <Text style={Typography.body}>{item.key}</Text>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    const NUM_ITEMS = 10;
    function getColor(i: number) {
        const multiplier = 255 / (NUM_ITEMS - 1);
        const colorVal = i * multiplier;
        return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
    }

    const initialData: Item[] = [...Array(NUM_ITEMS)].map((d, index) => {
        const backgroundColor = getColor(index);
        return {
            key: `item-${index}`,
            label: String(index) + "",
            height: 100,
            width: 60 + Math.random() * 40,
            backgroundColor,
        };
    });

    const [data, setData] = useState(initialData);


    return (
        <ConnectionDetection.View>
            <SafeAreaView><Header title={'Liên kết mạng xã hội'} /></SafeAreaView>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: floatingButtonContainer().height }}
            >
                <View style={{ paddingTop: 12, paddingBottom: 48, paddingHorizontal: 16 }}>
                    <Text style={Typography.body}>Để quảng cáo kênh mạng xã hội khác ở màn hình thông tin cá nhân, bạn hãy thêm thông tin như ID của mạng xã hội hoặc đường dẫn liên kết đến các trang đó nhé!</Text>
                </View>
                {/* <DraggableFlatList
                    data={data}
                    onDragEnd={({ data }) => setData(data)}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                /> */}
                <View style={{ ...styles.rowContainer, }}>
                    <Text style={Typography.title}>Instagram</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12 }}>
                        <Text style={Typography.name_button}>www.instagram.com</Text>
                        <Text style={{ ...Typography.name_button, marginHorizontal: 8 }}>/</Text>
                        <View style={{ flex: 1, bottom: 3 }}>
                            <InputBox initialValue={userInstagram} placeholder={'Nhập ID'} maxLength={30}
                                onChangeText={setUserInstagram} />
                        </View>
                    </View>
                    <Text style={{ ...Typography.description, color: Colors.red, textAlign: 'right', paddingTop: 8 }}>{instagramError ?? ''}</Text>

                </View>
                <View style={{ ...styles.rowContainer, }}>
                    <Text style={Typography.title}>Facebook</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12 }}>
                        <View style={{ flex: 1 }}>
                            <InputBox

                                initialValue={userFacebook} placeholder={'Nhập địa chỉ facebook'} maxLength={100}
                                onChangeText={setUserFacebook} />
                        </View>
                    </View>
                    <Text style={{ ...Typography.description, color: Colors.red, textAlign: 'right', paddingTop: 8 }}>{facebookError ?? ''}</Text>
                </View>
                <View style={{ ...styles.rowContainer, }}>
                    <Text style={Typography.title}>Tiktok</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12 }}>
                        <Text style={Typography.name_button}>www.tiktok.com</Text>
                        <Text style={{ ...Typography.name_button, marginHorizontal: 8 }}>/  @ </Text>
                        <View style={{ flex: 1, bottom: 3 }}>
                            <InputBox initialValue={userTiktok} placeholder={'Nhập ID'} maxLength={30}
                                onChangeText={setUserTiktok} />
                        </View>
                    </View>
                    <Text style={{ ...Typography.description, color: Colors.red, textAlign: 'right', paddingTop: 8 }}>{tiktokError ?? ''}</Text>

                </View>
                <View style={{ ...styles.rowContainer, }}>
                    <Text style={Typography.title}>Youtube</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12 }}>
                        <View style={{ flex: 1 }}>
                            <InputBox initialValue={userYoutube}
                                placeholder={'Nhập địa chỉ youtube'} maxLength={100}
                                onChangeText={setUserYoutube} />
                        </View>
                    </View>
                    <Text style={{ ...Typography.description, color: Colors.red, textAlign: 'right', paddingTop: 8 }}>{youtueError ?? ''}</Text>

                </View>
                <View style={{ ...styles.rowContainer, paddingBottom: 80 }}>
                    <Text style={Typography.title}>Trang cá nhân</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12 }}>
                        <View style={{ flex: 1 }}>
                            <InputBox initialValue={userETCUrl} placeholder={'Nhập địa chỉ trang cá nhân'} maxLength={100}
                                onChangeText={setUserETCUrl} />
                        </View>
                    </View>
                    <Text style={{ ...Typography.description, color: Colors.red, textAlign: 'right', paddingTop: 8 }}>{homepageError ?? ''}</Text>
                </View>

            </KeyboardAwareScrollView>
            <View style={floatingButtonContainer().style}>
                <Button
                    type={ButtonType.primary}
                    state={ButtonState.idle}
                    onPress={onSave}
                    text={'Bắt đầu'}
                />
            </View>
        </ConnectionDetection.View>
    );
}
    ;

export default SocialAccountSettingScreen;

const styles = StyleSheet.create({
    rowContainer: { flex: 1, marginBottom: 8, paddingHorizontal: 16 }

})