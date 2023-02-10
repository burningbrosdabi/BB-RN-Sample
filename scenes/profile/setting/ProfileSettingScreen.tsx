import { useNavigation } from '@react-navigation/native';
import { DabiFont } from 'assets/icons';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType, floatingButtonContainer, LayoutConstraint } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import ProfileImage from 'components/images/ProfileImage';
import { InputBox } from 'components/inputs/InputField.v2';
import { HandledError } from "error";
import { isNil } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Keyboard, Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Asset, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import { RoutePath } from 'routes';
import { updateAvatarApi, updateUserApi } from 'services/api';
import { openPermissionsDialog, postMessageToChannel } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { Colors, Typography } from '_styles';
import { AvatarOptionsModal } from '../AvatarOptionsModal';

const ProfileSettingScreen = () => {
    const { userInfo, } = useTypedSelector((state) => state.user);
    const { profile_image, id, name, user_id, description, insta_id, primary_style, secondary_style, weight, height } = userInfo;

    const [modalVisible, setModalVisble] = useState<boolean>(false);

    const [userID, setUserID] = useState<string>(user_id)
    const [userIDError, setUserIDError] = useState<string | undefined>(undefined)

    const [userName, setUserName] = useState<string>(name)
    const [userNameError, setUserNameError] = useState<string | undefined>(undefined)
    const [userWeight, setUserWeight] = useState<number | undefined>(weight)
    const [userHeight, setUserHeight] = useState<number | undefined>(height)
    const [validation, setValidation] = useState(true)


    const [userDescription, setUserDescription] = useState<string>(description)
    const [userInstagram, setUserInstagram] = useState<string>(insta_id || '')


    const {
        setLoading,
        showDialog,
        setUserInfo,
    } = useActions();
    const navigation = useNavigation()
    const toogleModal = () => {
        setModalVisble(!modalVisible);
    };

    const onSelectAvatarOption = (index: number) => {
        toogleModal();
        switch (index) {
            case 1:
                onAddPicture();
                break;
            case 2:
                _renderDeleteAlert();
                break;

            default:
                break;
        }
    };

    const _renderDeleteAlert = () => {
        showDialog({
            title: 'Bạn có chắc muốn xóa ảnh đại diện không?',
            actions: [
                {
                    type: ButtonType.primary,
                    text: 'Tiếp tục',
                    onPress: () => _onUploadImage(),
                },
                {
                    text: 'Rời khỏi',
                    type: ButtonType.flat,
                    onPress: () => {
                    },
                    textStyle: { color: Colors.primary },
                },
            ],
        });
    };


    const onAddPicture = () => {
        launchImageLibrary({
            quality: 0.8,
            mediaType: 'photo',
            selectionLimit: 1,
            includeBase64: true,
            maxWidth: 250,
            maxHeight: 250
        }, res => {
            if (res.didCancel) {
                return
            }
            if (res.errorCode) {
                console.log("Error", res.errorMessage)
                // camera_unavailable	camera not available on device || permission	Permission not satisfied || others	other errors (check errorMessage for description)
                openPermissionsDialog("Yêu cầu truy cập vào thư viện ảnh bị từ chối.");
            } else {
                _onUploadImage(res.assets?.pop())
            }
        })

    }

    const _onUploadImage = async (image?: Asset) => {
        // try {
        setLoading(true);
        const result = await updateAvatarApi({ profile_image: image?.base64 || '' });
        if (result) {
            setUserInfo({
                ...userInfo,
                profile_image: result.profile_image
            })
        }
        setLoading(false);
        toast("Cập nhật ảnh đại diện thành công");
        // } catch (error) {
        //     setLoading(false);
        //     showDialog({
        //         title: error.friendlyMessage,
        //         actions: [
        //             {
        //                 type: ButtonType.primary,
        //                 text: 'Ok',
        //                 onPress: () => { },
        //             },
        //         ],
        //     });
        // }
    };

    const _renderProfileEdit = () => {
        const size = 96
        return <View style={{
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Ripple onPress={toogleModal} style={{ alignItems: 'center', justifyContent: 'center', }}
                rippleContainerBorderRadius={size / 2}>
                <View style={{ height: 12 }} />
                <ProfileImage size={size} source={profile_image} pk={id} style={{ borderWidth: 0 }} />
                <View style={{
                    overflow: 'hidden',
                    width: size,
                    height: size / 2,
                    position: 'absolute',
                    bottom: 0,
                    borderBottomLeftRadius: size / 2,
                    borderBottomRightRadius: size / 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Image style={{
                        tintColor: 'white'
                    }} source={require('_assets/images/fontable/camera_icon.png')} />
                </View>
            </Ripple></View>
    }

    const backSubscription = useRef(() => {
    })

    const onSave = useCallback(async (newDescription?: string) => {
        try {
            setLoading(true)
            const userInfo = await updateUserApi({
                user_id: userID,
                name: userName,
                description: newDescription,
                weight: userWeight,
                height: userHeight
            })
            Keyboard.dismiss();
            setUserInfo(userInfo);
            //feedStream.next(); // reload feedback list in profile
            toast('Thông tin tài khoản đã được cập nhật!')
            backSubscription.current();
            navigation.goBack()
        } catch (e) {
            const error = new HandledError({
                error: e as Error,
                stack: 'ProfileUpdateScreen.onSave'
            });
            console.log(e)
            toast(error.friendlyMessage)
        } finally {
            setLoading(false)
        }

    }, [userID, userName, userInstagram, userDescription, userWeight, userHeight])


    const _onConfirm = useCallback(async () => {
        if (userName.length <= 3) {
            toast('Tên phải dài hơn 3 kí tự')
            return
        }
        const newDescription = description !== userDescription ? (userDescription.toString() || "") : undefined
        let newInstagram = insta_id !== userInstagram ? (userInstagram.toString() || "") : undefined
        if (!insta_id && !userInstagram) newInstagram = undefined;
        if (newDescription !== undefined || newInstagram !== undefined || userName !== name) {
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
    }, [userName, userInstagram, userDescription])

    useEffect(() => {
        backSubscription.current();
        backSubscription.current = navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            _onConfirm();
        });
    }, [userName, userInstagram, userDescription])

    const _onEditUserName = (text: string) => {
        setUserName(text)
        if (text.length <= 3) {
            setUserNameError('Tên phải dài hơn 3 kí tự')
            setValidation(false)
            return
        }
        if (!userIDError) setValidation(true)
        setUserNameError(undefined)
    }

    const _onEditUserID = (text: string) => {
        const regEx = /^[A-Za-z0-9_.]+$/
        console.log(regEx.test(text))
        setUserID(text)
        if (!regEx.test(text) || text.length <= 5) {
            setUserIDError('Tên phải có ít nhất 6 kí tự, chỉ hỗ trợ chữ cái và "_".')
            setValidation(false)

            return
        }
        if (!userNameError) setValidation(true)
        setUserIDError(undefined)
    }

    const _onDeleteAcccount = () => {
        showDialog({
            title: 'Bạn có thật sự muốn xóa tài khoản này không? (Vui lòng để lại thông tin của bạn ở Messenger. DABI sẽ liên lạc với bạn sớm nhất có thể. Xin lỗi vì sự bất tiện này.)',
            actions: [
                {
                    type: ButtonType.primary,
                    text: 'Huỷ',
                    onPress: () => {
                        const messengerLink = 'http://m.me/' + 'dabivietnam';
                        const pageLink = 'https://www.facebook.com/' + '106467717966358';
                        postMessageToChannel({ message: `User asked to delete account ${user_id}(pk:${id})`, channel: 'general_feedbacks' })
                        try {
                            Linking.openURL(messengerLink);
                        } catch {
                            Linking.openURL(pageLink);
                        }
                    },
                },
                {
                    text: 'Quay lại',
                    onPress: () => {
                    },
                    type: ButtonType.flat,
                },
            ],
        });
    }
    return (
        <ConnectionDetection.View>
            <SafeAreaView>
                <Header title='Cài đặt thông tin cá nhân' />
            </SafeAreaView>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flex: 1, paddingHorizontal: 24, paddingBottom: 100 }}>
                    <View style={styles.rowContainer}>
                        {_renderProfileEdit()}
                    </View>
                    <View style={styles.rowContainer}>
                        <InputBox text={'Tên người dùng'}
                            error={userIDError}
                            initialValue={userID}
                            placeholder={'Nhập ID của bạn'}
                            maxLength={30}
                            onChangeText={_onEditUserID} />
                    </View>
                    <View style={styles.rowContainer}>
                        <InputBox text={'Họ và tên'}
                            error={userNameError}
                            initialValue={userName}
                            placeholder={'Nhập tên của bạn'}
                            maxLength={30}
                            onChangeText={_onEditUserName} />
                    </View>
                    <View style={styles.rowContainer}>
                        <InputBox text={'Lời giới thiệu'}
                            initialValue={userDescription}
                            placeholder={'Nhập lời giới thiệu của bạn'}
                            numberOfLines={5} maxLength={150}
                            onChangeText={setUserDescription} />
                    </View>
                    <View style={styles.rowContainer}>
                        <Text style={Typography.name_button}>Phong cách của tôi</Text>
                        <View style={{ height: 12 }} />
                        <Ripple
                            onPress={() => { navigation.navigate(RoutePath.styleSetting) }}
                            style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {isNil(primary_style && secondary_style) && <Text style={Typography.body}>Cập nhật phong cách thời trang</Text>}
                            {primary_style && <Text style={{ ...Typography.body, color: Colors.blue }}>#{primary_style}{secondary_style ? ', #' + secondary_style : ''}</Text>}

                            <View style={{ width: 4 }} />
                            <DabiFont name='small_arrow_right' size={12} />
                        </Ripple>
                    </View>
                    <View style={styles.rowContainer}>
                        <InputBox text={'Chiều cao (cm)'}
                            initialValue={userHeight?.toString()}
                            onChangeText={setUserHeight}
                            placeholder={'Nhập chiều cao (cm)'}
                            maxLength={3}
                            keyboardType='number-pad' />
                    </View>
                    <View style={styles.rowContainer}>
                        <InputBox text={'Cân nặng (kg)'}
                            placeholder={'Nhập cân nặng (kg)'}
                            initialValue={userWeight?.toString()}
                            onChangeText={setUserWeight}
                            maxLength={3}
                            keyboardType='number-pad' />
                    </View>
                    <View style={styles.rowContainer}>
                        <Button
                            innerHorizontalPadding={0}
                            text={'Xoá tài khoản'}
                            type={ButtonType.flat}
                            color={Colors.black}
                            textStyle={{ ...Typography.description, color: Colors.text, textTransform: 'none' }}
                            onPress={_onDeleteAcccount}
                            constraint={LayoutConstraint.wrapChild}
                        />
                    </View>
                </View>


            </KeyboardAwareScrollView>
            <AvatarOptionsModal
                visible={modalVisible}
                onClose={toogleModal}
                onSelect={onSelectAvatarOption}
            />
            <View style={floatingButtonContainer().style}>
                <Button
                    type={ButtonType.primary}
                    state={!validation ? ButtonState.disabled : ButtonState.idle}
                    onPress={() => onSave(userDescription)}
                    disabled={!validation}
                    text={'Lưu'}
                />
            </View>
        </ConnectionDetection.View>
    );
}
    ;

export default ProfileSettingScreen;

const styles = StyleSheet.create({
    rowContainer: { flex: 1, marginBottom: 24, }

})