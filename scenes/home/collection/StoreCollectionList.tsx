import { useNavigation } from '@react-navigation/native';
import StoreFavoriteTextButton from 'components/button/store/StoreFavoriteTextButton';
import ProfileImage from 'components/images/ProfileImage';
import { StoreCollection } from 'model/collection/collection';
import { StoreCollectionItem } from 'model/collection/collection.item';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { RoutePath } from 'routes';
import { Typography } from 'styles';
import { screen } from 'styles/spacing';
import { CollectionContainer } from './CollectionContainer';

const ItemWidth = 128;
const ItemHeight = 160;
const ButtonWidth = 90;

export const StoreCollectionList = ({ data }: { data: StoreCollection }) => {
    const renderItem = ({ item, index }: { item: StoreCollectionItem; index: number }) => {
        return (
            <View
                style={{
                    width: ItemWidth + 12,
                    height: 160,
                    paddingRight: 12,
                }}>
                <_Item item={item} />
            </View>
        );
    };

    const keyExtractor = (_: StoreCollectionItem, index: number) => {
        return `${index}`;
    };

    return (
        <CollectionContainer data={data}>
            <View style={{ height: 24 }} />
            <View style={{ width: screen.width, height: ItemHeight }}>
                <FlatList<StoreCollectionItem>
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}
                    data={data.items}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                />
            </View>
        </CollectionContainer>
    );
};

const _Item = ({ item }: { item: StoreCollectionItem }) => {
    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate(RoutePath.storeDetail, { store: { pk: item.pk } });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Ripple
                rippleContainerBorderRadius={4}
                onPress={onPress}
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    borderRadius: 4,
                    paddingVertical: 24,
                    paddingHorizontal: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <ProfileImage source={item.profile_image} />
                <View style={{ height: 4 }} />
                <Text numberOfLines={1} style={Typography.name_button}>
                    {item.insta_id}
                </Text>
                <View style={{ flex: 1 }} />
            </Ripple>
            <View style={{
                position: 'absolute',
                bottom: 24,
                width: ButtonWidth,
                left: (ItemWidth - ButtonWidth) / 2,
            }}>
                <StoreFavoriteTextButton
                    data={item}
                />
            </View>
        </View>
    );
};
