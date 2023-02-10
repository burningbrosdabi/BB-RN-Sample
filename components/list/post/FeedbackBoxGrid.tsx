import { DabiFont } from "assets/icons";
import { ImageElementFlex } from "components/images/ImageElement";
import ProfileImage from "components/images/ProfileImage";
import { isEmpty, isNil } from "lodash";
import { FeedbackInfo } from "model";
import { UserType } from "model/user/user";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { PlaceholderMedia } from "rn-placeholder";
import { FeedDetailRouteSetting } from "routes/feed/feed.route";
import { useNavigator } from "services/navigation/navigation.service";
import { applyOpacity, Colors, Typography } from "styles";
import { dateTimeDiff } from "utils/helper";


export const FeedbackBoxGrid = ({ data, showSpec = false, showUser = false }: { data: FeedbackInfo, showSpec?: boolean, showUser?: boolean }) => {

    const {
        thumbnail_image,
        post_thumb_image,
        influencer,
        media_type, created_at
    } = data;
    const { weight, height } = influencer
    const time = dateTimeDiff(created_at);

    const navigator = useNavigator();

    return <TouchableOpacity activeOpacity={0.7} onPress={() => {
        navigator.navigate(new FeedDetailRouteSetting({ pk: data.pk }))
    }} style={{ flex: 1 }} key={data.pk}>
        <View style={{
            width: '100%',
            aspectRatio: 4 / 5
        }}>
            <ImageElementFlex image={!isEmpty(thumbnail_image) ? thumbnail_image : post_thumb_image} />
            {
                media_type == 2 &&
                <View style={{ position: 'absolute', right: 12, top: 12, zIndex: 1 }}>
                    <DabiFont size={20} name={'multi'} color={'white'} />
                </View>
            }
            {
                media_type == 1 &&
                <View style={{ position: 'absolute', right: 12, top: 12, zIndex: 1 }}>
                    <DabiFont size={20} name={'video'} color={'white'} />
                </View>
            }
            {showSpec && !isNil(height || weight) &&
                <View style={{ position: 'absolute', left: 0, right: 0 }}>
                    <LinearGradient colors={[applyOpacity(Colors.black, 0.8), 'transparent']} style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}>
                        <DabiFont name="my_filled" size={12} color={Colors.white} />
                        <View style={{ width: 4 }} />
                        <Text style={{ ...Typography.description, color: Colors.white }}>{!isNil(height) && (height + 'cm')}{!isNil(height && weight) && ", "}{!isNil(weight) && (weight + 'kg')}</Text>
                    </LinearGradient>
                </View>
            }

            {showUser && influencer && <View style={{ position: 'absolute', left: 0, right: 0 }}>
                <LinearGradient colors={[applyOpacity(Colors.black, 0.8), 'transparent']} style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                        <ProfileImage source={influencer?.profile_image} size={24} />
                        <View style={{ width: 8 }} />
                        <View style={{ flex: 1, paddingRight: 32 }}>
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ ...Typography.name_button, color: Colors.white }} numberOfLines={1}>{influencer?.name}</Text></View>
                                {!isNil(influencer?.user_type) && influencer?.user_type == UserType.INFLUENCER && (
                                    <View style={{ marginLeft: 4, height: 20, bottom: 1, justifyContent: 'center' }}>
                                        <DabiFont name={'crown'} size={12} color={Colors.red} />
                                    </View>
                                )}
                                {!isNil(influencer?.user_type) && influencer?.user_type == UserType.SELLER && (
                                    <View style={{ marginLeft: 4, height: 20, bottom: 1, justifyContent: 'center' }}>
                                        <DabiFont name={'small_store'} size={12} color={Colors.red} />
                                    </View>
                                )}</View>
                            <Text style={{ ...Typography.description, color: Colors.white }}>{time}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>}
        </View>
    </TouchableOpacity>
}

export const FeedbackBoxGridPlaceholder = () => {
    return <View style={{ flex: 1 }}>
        <View style={{
            width: '100%',
            aspectRatio: 4 / 5,
        }}>
            <PlaceholderMedia
                style={{
                    flex: 1,
                    width: '100%',
                }}
            />
        </View>
    </View>
}

export const FeedbackGridRowPlaceholder = () => {
    return <View>
        <View
            style={{ flexDirection: 'row' }}>
            <FeedbackBoxGridPlaceholder />
            <View style={{ width: 8 }} />
            <FeedbackBoxGridPlaceholder />
        </View>
        <View style={{ height: 8, width: '100%' }} />
    </View>
}