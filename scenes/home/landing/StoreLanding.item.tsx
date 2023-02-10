import { useNavigation } from '@react-navigation/native';
import CertifiedMarkIcon from 'assets/icons/store/CertifiedMarkIcon';
import PartnershipMarkIcon from 'assets/icons/store/PartnershipMarkIcon';
import StoreFavoriteTextButton from 'components/button/store/StoreFavoriteTextButton';
import ProfileImage from 'components/images/ProfileImage';
import { isNil, range } from 'lodash';
import { ProductSource } from 'model/product/ProductSource';
import { StoreLandingItem } from 'model/collection/collection.item';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { PlaceholderLine, PlaceholderMedia } from 'rn-placeholder';
import { ProductDetailRouteSetting } from 'routes';
import { RoutePath } from 'routes/RouteSetting';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { FollowCount } from "components/text/StoreFollowText";


export const Item = ({ data }: { data: StoreLandingItem }) => {
    const navigator = useNavigator();

    return (
        <View style={styles.itemContainer}>
            <View style={{ justifyContent: 'center' }}>
                <ItemHeader data={data} />
                <View style={{ position: 'absolute', right: 16 }}>
                    <StoreFavoriteTextButton
                        data={data}
                    />
                </View>
            </View>
            <View style={styles.itemProductsContainer}>
                {range(3).map((_, index) => {
                    const product = data.products[index];
                    const onPress = () => {
                        if (!product) return;
                        navigator.navigate(new ProductDetailRouteSetting({ productPk: product.pk }));
                    };

                    return (
                        <View key={`${index}`} style={styles.itemImageContainer}>
                            <Ripple
                                onPress={onPress}
                                rippleContainerBorderRadius={4}
                                style={styles.itemImageContent}>
                                {!isNil(product) ? (
                                    <Image key={index} source={{ uri: product.image }} style={{ flex: 1 }} />
                                ) : (
                                    <></>
                                )}
                            </Ripple>
                        </View>
                    );
                })}
            </View>
            <View style={{ height: 12 }} />
        </View>
    );
};

const ItemHeader = ({ data }: { data: StoreLandingItem }) => {
    const navigation = useNavigation();
    const onPress = () => {
        navigation.navigate(RoutePath.storeDetail, { store: { pk: data.pk } });
    };

    return (
        <Ripple onPress={onPress} style={styles.itemHeaderContainer}>
            <ProfileImage source={{ uri: data.profile_image }} />
            <View style={{ width: 12 }} />
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flex: 1,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text numberOfLines={1} style={Typography.name_button}>
                        {data.insta_id}
                    </Text>
                    <View style={{ width: 4 }} />
                    {data.type === ProductSource.CERTIFIED && <CertifiedMarkIcon />}
                    {data.type === ProductSource.PARTNERSHIP && <PartnershipMarkIcon />}
                </View>
                <FollowCount pk={data.pk} initialCount={data.favorite_users_count} />
            </View>
            <View
                style={{
                    width: 90 + 16 + 12 /**button width + padding + padding with icon*/,
                    backgroundColor: 'yellow',
                }}
            />
        </Ripple>
    );
};

export const ItemPlaceholder = () => {
    return (
        <View style={styles.itemContainer}>
            <View style={{ justifyContent: 'center' }}>
                <View style={styles.itemHeaderContainer}>
                    <PlaceholderMedia
                        style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'white' }}
                    />
                    <View style={{ width: 12 }} />
                    <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                        <PlaceholderLine noMargin style={{ height: 18, width: 60, backgroundColor: 'white' }} />
                        <View style={{ height: 3 }} />
                        <PlaceholderLine
                            noMargin
                            style={{ height: 18, width: 120, backgroundColor: 'white' }}
                        />
                    </View>
                    <View style={{ flex: 1 }} />
                    <PlaceholderMedia style={{ width: 68, height: 24, backgroundColor: 'white' }} />
                </View>
            </View>
            <View style={styles.itemProductsContainer}>
                {range(3).map((_, index) => {
                    return (
                        <View key={`${index}`} style={styles.itemImageContainer}>
                            <PlaceholderMedia
                                style={[styles.itemImageContent, { width: '100%', backgroundColor: 'white' }]}
                            />
                        </View>
                    );
                })}
            </View>
            <View style={{ height: 12 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: { flex: 1, borderTopWidth: 1, borderTopColor: Colors.background },
    itemHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    itemProductsContainer: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'stretch',
        flex: 1,
    },
    itemImageContainer: { paddingHorizontal: 6, flex: 1, borderRadius: 4 },
    itemImageContent: {
        flex: 1,
        backgroundColor: Colors.background,
        borderRadius: 4,
        overflow: 'hidden',
    },
});
