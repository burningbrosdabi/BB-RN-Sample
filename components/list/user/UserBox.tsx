import { useNavigation } from '@react-navigation/core';
import { DabiFont } from 'assets/icons';
import ProfileImage from 'components/images/ProfileImage';
import { isNil } from 'lodash';
import { Influencer } from 'model/influencer/influencer';
import { UserInfoImpl, UserType } from 'model/user/user';
import React from 'react';
import { Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { RoutePath } from 'routes';
import { FollowButton } from 'scenes/user/follow/FollowButton';
import { Colors, Typography } from 'styles';

export const UserBox = ({
    data,
}: {
    data: UserInfoImpl;
}) => {
    const { profile_image, name, weight, height, user_id, user_type, } = data;
    let id = data.id ?? data.pk
    const testID = `item-${id}`;

    const navigation = useNavigation();

    const navigate = () => {
        navigation.navigate({
            name: RoutePath.UserProfile,
            key: id,
            params: { pk: id, },
        });
    };

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Ripple onPress={navigate} style={{
                flex: 1,
                height: 64,
                flexDirection: 'row',
                paddingHorizontal: 16,
                alignItems: 'center',
            }} testID={testID}>
                <ProfileImage size={48} source={profile_image} />
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={Typography.name_button}>
                            {user_id}
                        </Text>
                        {user_type == UserType.INFLUENCER && (<View style={{ paddingLeft: 4, paddingBottom: 1 }}>
                            <DabiFont name={'crown'} size={12} color={Colors.red} />
                        </View>)}
                        {user_type == UserType.SELLER && (<View style={{ paddingLeft: 4, paddingBottom: 1 }}>
                            <DabiFont name={'small_store'} size={12} color={Colors.red} />
                        </View>)}
                    </View>
                    <Text numberOfLines={1} style={{ ...Typography.description, color: Colors.component }}>
                        {name}
                    </Text>
                    {!isNil(height || weight) &&
                        <Text style={[Typography.description]}>
                            {!isNil(height) && (height + 'cm')}
                            {!isNil(height && weight) && ", "}
                            {!isNil(weight) && (weight + 'kg')}
                        </Text>}
                </View>
            </Ripple>
            <View
                style={{ paddingRight: 16, paddingLeft: 12, justifyContent: 'center' }}>
                <FollowButton
                    pk={id}
                    name={name}
                />
            </View>
        </View>
    );
};



