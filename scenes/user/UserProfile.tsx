import { useNavigation } from "@react-navigation/native";
import { DabiFont } from "assets/icons";
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import ProfileImage from "components/images/ProfileImage";
import { get, isNil } from "lodash";
import { Influencer } from "model/influencer/influencer";
import { UserInfo, UserType } from "model/user/user";
import React, { useEffect, useRef, useState } from 'react';
import { Image, Linking, SafeAreaView, Text, View } from 'react-native';
import Ripple from "react-native-material-ripple";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from "rn-placeholder";
import { profileUpdateRouteSetting, settingsRouteSetting, userFollowListRouteSetting } from 'routes';
import { FollowButton } from 'scenes/user/follow/FollowButton';
import { createSocialViewLog, getUserInfo } from "services/api";
import { http } from "services/http/http.service";
import { NavigationService } from 'services/navigation';
import { userFollowController } from "services/user";
import { fontPlaceHolder } from "styles/typography";
import { Colors, secondary, Typography } from '_styles';

interface socialAccountsType {
    id?: string;
    name: string;
    iconColor: string;
    iconWhite: string;
    key: number

}
export const UserProfile = ({
    myProfile,
    data,
    onUnfollow
}: { myProfile?: boolean, data: UserInfo, onUnfollow: () => void }) => {
    const { user_id, name, profile_image,
        description, following, follower,
        primary_style, secondary_style,
        height, weight, insta_id,
        facebook_id, tiktok_id, youtube_id, etc_id, user_type } = data;
    const pk = get(data, 'pk') ?? get(data, 'id');
    const navigateToSetting = () => NavigationService.instance.navigate(new settingsRouteSetting)
    const [socialAccountModalVisibled, setSocialAccountModalVisbled] = useState<boolean>(false);
    const toogleSocialAccountModal = () => {

        setSocialAccountModalVisbled(!socialAccountModalVisibled);
    }
    useEffect(() => {
        if (!myProfile) return
        const subscription = userFollowController.nextStream.subscribe(() => {
            getUserInfo();
        })
        return () => {
            subscription.unsubscribe();
        }
    }, [])



    const _renderSocialAccount = () => {
        // INSTAGRAM, FACEBOOK, TIKTOK, YOUTUBE, ETC = range(5)
        const socialAccounts: socialAccountsType[] = [{
            id: insta_id && 'https://www.instagram.com/' + insta_id, name: 'Instagram', iconColor: require('/assets/images/social/Insta/Instagram.png'), iconWhite: require('/assets/images/social/Insta/Instagram_W.png'), key: 0
        }, {
            id: facebook_id, name: 'Facebook', iconColor: require('/assets/images/social/Facebook/Facebook.png'), iconWhite: require('/assets/images/social/Facebook/Facebook_W.png'), key: 1
        }, {
            id: tiktok_id && 'https://www.tiktok.com/@' + tiktok_id, name: 'Tiktok', iconColor: require('/assets/images/social/Tiktok/Tiktok.png'), iconWhite: require('/assets/images/social/Tiktok/Tiktok_W.png'), key: 2
        }, {
            id: youtube_id, name: 'Youtube', iconColor: require('/assets/images/social/Youtube/Youtube.png'), iconWhite: require('/assets/images/social/Youtube/Youtube_W.png'), key: 3
        }, {
            id: etc_id, name: 'Website', iconColor: require('/assets/images/social/Homepage/Homepage.png'), iconWhite: require('/assets/images/social/Homepage/Homepage_W.png'), key: 4
        }].filter(d => !isNil(d.id))
        // socialAccountMap(socialAccounts[0])
        let firstIcon = <></>
        let secondIcon = <></>
        switch (socialAccounts.length) {
            case 0:
                return
            case 1:
                break
            case 2:
                firstIcon = <Ripple
                    style={{ padding: 12, marginLeft: 12, marginRight: 12 }}
                    onPress={() => {
                        // https://test.dabi-api.com/api/v1/influencers/9/social_logs/
                        Linking.openURL(socialAccounts[1].id)
                        createSocialViewLog({ pk, type: socialAccounts[1].key })
                    }}
                    rippleContainerBorderRadius={24}
                ><Image
                        width={24}
                        height={24}
                        style={{ width: 24, height: 24 }}
                        source={socialAccounts[1].iconColor} />
                </Ripple>
                break
            case 3:
                firstIcon = <Ripple
                    style={{ padding: 12, marginLeft: 12, marginRight: 12 }}
                    onPress={() => {
                        Linking.openURL(socialAccounts[1].id)
                        createSocialViewLog({ pk, type: socialAccounts[1].key })

                    }}
                    rippleContainerBorderRadius={24}
                ><Image
                        width={24}
                        height={24}
                        style={{ width: 24, height: 24 }}
                        source={socialAccounts[1].iconColor} />
                </Ripple>
                secondIcon = <Ripple
                    style={{ padding: 12, marginLeft: 12, marginRight: 12 }}
                    rippleContainerBorderRadius={24}
                    onPress={() => {
                        Linking.openURL(socialAccounts[2].id)
                        createSocialViewLog({ pk, type: socialAccounts[2].key })
                    }}
                ><Image
                        width={24}
                        height={24}
                        style={{ width: 24, height: 24 }}
                        source={socialAccounts[2].iconColor} />
                </Ripple>
                break
            default:
                firstIcon = <Ripple
                    style={{ padding: 12, marginLeft: 12, marginRight: 12 }}
                    onPress={() => {
                        Linking.openURL(socialAccounts[1].id)
                        createSocialViewLog({ pk, type: socialAccounts[1].key })
                    }}
                    rippleContainerBorderRadius={24}
                ><Image
                        width={24}
                        height={24}
                        style={{ width: 24, height: 24 }}
                        source={socialAccounts[1].iconColor} />
                </Ripple>
                secondIcon = <Ripple
                    style={{ padding: 12, alignItems: 'center', justifyContent: 'center' }}
                    rippleContainerBorderRadius={24}
                    onPress={toogleSocialAccountModal}
                ><Text style={Typography.name_button}>
                        {socialAccounts.length - 2}+
                    </Text>
                </Ripple>
        }
        return <View style={{ flexDirection: 'row', marginBottom: 24 }}>
            <Button
                text={socialAccounts[0].name}
                onPress={() => {
                    Linking.openURL(socialAccounts[0].id)
                    createSocialViewLog({ pk, type: socialAccounts[0].key })

                }}
                type={ButtonType.primary}
                style={{
                    borderWidth: 0
                }}
                constraint={LayoutConstraint.matchParent}
                prefixIcon={<Image style={{ width: 24, height: 24, marginRight: 12 }}
                    source={socialAccounts[0].iconWhite} />}
            />
            {firstIcon}
            {secondIcon}
            <SocialAccountModal
                onClose={toogleSocialAccountModal}
                visible={socialAccountModalVisibled}
                data={socialAccounts}
                user_pk={pk} />
        </View>
    }

    return (
        <View style={{ paddingHorizontal: 16, borderBottomWidth: 1, borderColor: Colors.line }}>
            <View style={{
                alignItems: 'center'
            }}>
                <ProfileImage
                    size={96}
                    pk={pk}
                    source={profile_image}
                    border={false}
                />
            </View>
            <View style={{ height: 24 }} />
            <View style={{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap'
            }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ ...Typography.title, paddingRight: 4 }}>
                            {user_id}
                        </Text>
                        <View style={{ bottom: 1, height: 20, justifyContent: 'center' }}>
                            {user_type == UserType.INFLUENCER && <DabiFont name={'crown'} size={12} color={Colors.red} />}
                            {user_type == UserType.SELLER && <DabiFont name={'small_store'} size={12} color={Colors.red} />}
                        </View>
                    </View>
                    {!isNil(name) && <Text style={Typography.description}>{name}</Text>}
                </View>
                <View style={{ width: 24 }} />
                <View style={{ minHeight: 28 }}>
                    {!myProfile ? <FollowButton name={data.name} pk={pk} onUnfollow={onUnfollow} /> :
                        <Ripple
                            onPress={navigateToSetting}
                            rippleContainerBorderRadius={14}>
                            <View style={{
                                paddingVertical: 3, paddingHorizontal: 12, borderColor: Colors.black,
                                backgroundColor: Colors.black,
                                borderRadius: 14,
                            }}>
                                <Text style={{ ...Typography.body, color: Colors.white }}>Cài đặt</Text>
                            </View>
                        </Ripple>
                    }
                </View>
            </View>
            <View style={{ height: 24 }}></View>
            {!isNil(height || weight) && <Text style={Typography.description}>{!isNil(height) && (height + 'cm')}{!isNil(height && weight) && ", "}{!isNil(weight) && (weight + 'kg')}</Text>}
            <View style={{ height: 12 }} />
            <View>
                {description ? <>
                    <Text style={Typography.body}>{description}</Text>
                    <View style={{ height: 12 }} />
                </> : <></>}
                {primary_style && <Text style={{ ...Typography.body, color: Colors.blue }}>#{primary_style}{secondary_style ? ', #' + secondary_style : ''}</Text>}
                <View style={{
                    flexDirection: 'row',
                }}>
                    <Ripple
                        onPress={() => NavigationService.instance.navigate(new userFollowListRouteSetting({ key: 0, pk }))}
                        style={{ alignItems: 'center', paddingVertical: 12, flexDirection: 'row' }}>
                        <Text style={Typography.name_button}>{following}</Text>
                        <View style={{ width: 4 }} />
                        <Text style={Typography.body}>Đang theo</Text>
                    </Ripple>
                    <View style={{ width: 12 }} />
                    <Ripple
                        onPress={() => NavigationService.instance.navigate(new userFollowListRouteSetting({ key: 1, pk }))}
                        style={{ alignItems: 'center', paddingVertical: 12, flexDirection: 'row' }}>
                        <FollowersText initialCount={follower} pk={pk} />
                        <View style={{ width: 4 }} />
                        <Text style={Typography.body}>Người theo</Text>
                    </Ripple>
                </View>
                <View style={{ height: 12 }} />
                {_renderSocialAccount()}
            </View>
        </View>
    );
}


export const UserProfilePlaceholder = () => {
    return <Placeholder Animation={Fade}>
        <View style={{ paddingHorizontal: 16 }}>
            <View style={{
                alignItems: 'center'
            }}>
                <PlaceholderMedia style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: 'white' }} />
            </View>
            <View style={{ height: 24 }} />

            <View style={{
                flexDirection: 'row', alignItems: 'center'
            }}>
                <View>
                    <PlaceholderLine noMargin style={{ height: 16, width: 80 }} />
                    <PlaceholderLine noMargin style={fontPlaceHolder.description} />
                </View>
                <View style={{ flex: 1 }} />
                <PlaceholderLine noMargin style={{ height: 28, width: 120 }} />
            </View>
            <View style={{ height: 24 }} />
            <View>
                <PlaceholderLine noMargin style={{ height: 16, width: '100%', backgroundColor: 'white' }} />
                <View style={{ height: 4 }} />
                <PlaceholderLine noMargin style={{ height: 16, width: '100%', backgroundColor: 'white' }} />
            </View>
            <View style={{ height: 12 }} />
            <View style={{
                flexDirection: 'row', alignItems: 'center'
            }}>
                <PlaceholderLine noMargin style={{ height: 16, width: 100, backgroundColor: 'white' }} />
                <View style={{ width: 4 }} />
                <PlaceholderLine noMargin style={{ height: 16, width: 100, backgroundColor: 'white' }} />
            </View>
            <View style={{ height: 24 }} />
        </View></Placeholder>
}

const FollowersText = ({ initialCount, pk }: { initialCount: number, pk: number }) => {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        const subscription = userFollowController.stream.subscribe(
            (value) => {
                if (value.pk !== pk) return;
                const is_following = value.is_following;
                setCount(count + (is_following ? 1 : -1))
            }
        )
    }, [count])
    return <Text style={{ ...Typography.name_button }}>{count}</Text>
}

interface Props {
    onClose?: () => void;
    visible: boolean;
    setCategory: () => void;
    data: [socialAccountsType] | null;
    refresh: () => void;
    user_pk: number;
}

const SocialAccountModal = ({
    onClose = () => {
        /*** */
    },
    visible,
    data, user_pk
}: Props) => {
    const modalizeRef = useRef<Modalize>(null);

    useEffect(() => {
        if (visible) {
            modalizeRef.current?.open();
        } else {
            modalizeRef.current?.close();
        }
    }, [visible]);

    return (
        <Portal>
            <Modalize
                panGestureEnabled={false}
                ref={modalizeRef}
                rootStyle={{ zIndex: 10, elevation: 10 }}
                scrollViewProps={{ showsVerticalScrollIndicator: false }}
                onClosed={onClose}
                adjustToContentHeight
                withHandle={false}>
                <View style={{ marginTop: 24 }}>
                    {data?.map((item, index) => {
                        return <Ripple
                            key={`${index}`}
                            style={{ padding: 12, marginLeft: 12, marginRight: 12 }}
                            rippleContainerBorderRadius={24}
                            onPress={() => {
                                Linking.openURL(item.id)
                                createSocialViewLog({ pk: user_pk, type: item.key })
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <Image
                                        width={24}
                                        height={24}
                                        style={{ width: 24, height: 24 }}
                                        source={item.iconColor} />
                                    <View style={{ width: 8 }} />
                                    <Text style={Typography.name_button}>{item.name}
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}><Text style={Typography.body}>Visit</Text>
                                    <View style={{ width: 8 }} />
                                    <DabiFont name={'small_arrow_right'} size={12} /></View>

                            </View>
                        </Ripple>
                    })}
                    <SafeAreaView />
                </View>
            </Modalize>
        </Portal>
    );

}
export default UserProfile