import SalesIcon from 'assets/icons/product/SalesIcon';
import { FlashSaleTimmer } from 'components/timmer/FlashSaleTimmer';
import ProductHeartButton from 'components/button/product/ProductHeartButton';
import GradientTextBox from 'components/box/GradientTextBox';
import { range } from 'lodash';
import {
    FlashSaleCollection,
    ItemTransition,
    ProductCollection,
    ProductCollectionItem,
} from 'model/collection';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Carousel from 'react-native-snap-carousel';
import { PlaceholderMedia } from 'rn-placeholder';
import { ProductDetailRouteSetting } from 'routes/product/productDetail.route';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { screen } from 'styles/spacing';
import { fontExtraBold } from 'styles/typography';
import { toPriceFormat } from 'utils/helper/FormatHelper';
import { CollectionContainer, CollectionContainerPlaceholder } from './CollectionContainer';
import { getProductThumbnail } from "_helper";

moment.locale('vi');

interface Props {
    data: ProductCollectionItem[];
    transition: ItemTransition;
}

export const FlashSaleCollections = ({ data }: { data: FlashSaleCollection }) => {
    return (
        <CollectionContainer data={data}>
            <View style={{ height: 4 }} />
            <FlashSaleTimmer end={data.end_at} />
            <View style={{ height: 24 }} />
            <_Transition data={data.items} transition={data.item_transition} />
        </CollectionContainer>
    );
};

export const ProductCollections = ({ data }: { data: ProductCollection }) => {

    return (
        <CollectionContainer data={data}>
            <View style={{ height: 24 }} />
            <_Transition data={data.items} transition={data.item_transition} />
        </CollectionContainer>
    );
};

export const _Transition = ({ data, transition }: Props) => {
    if (transition === ItemTransition.slide) return <_Slide data={data} />;
    return <_Carousel data={data} />;
};

const _Slide = ({ data }: { data: ProductCollectionItem[] }) => {
    const renderItem: ListRenderItem<ProductCollectionItem> = ({ item, index }) => {
        return (
            <View style={styles.slideContainer}>
                <_SlideItem item={item} />
            </View>
        );
    };

    const keyExtractor = (item: ProductCollectionItem, index: number) => {
        return `${item.pk}`;
    };

    return (
        <FlatList<ProductCollectionItem>
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 4 }}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
        />
    );
};

const _SlideItem = ({ item }: { item: ProductCollectionItem }) => {
    const navigator = useNavigator();

    const onPress = () => {
        navigator.navigate(new ProductDetailRouteSetting({ productPk: item.pk }));
    };

    const image = useMemo(() => {
        return getProductThumbnail(item);
    }, [item])

    return (
        <Ripple
            onPress={onPress}
            rippleContainerBorderRadius={4}
            style={{ backgroundColor: 'white', flex: 1, borderRadius: 4, paddingBottom: 10 }}>
            <View style={{ flex: 1 }}>
                <Image source={{ uri: image }} style={styles.slideItemImage} />
                {item.is_discount && (
                    <GradientTextBox
                        text={`-${item.discount_rate}%`}
                        left
                        containerStyle={styles.tag}
                        icon={<SalesIcon />}
                    />
                )}
            </View>
            <View style={{ paddingHorizontal: 8, paddingTop: 4 }}>
                <Text
                    numberOfLines={1}
                    style={[
                        Typography.option,
                        {
                            color: Colors.primary,
                            textTransform: 'none',
                        },
                    ]}>
                    {toPriceFormat(item.final_price())}
                </Text>
                {
                    item.is_discount ? <Text
                        numberOfLines={1}
                        style={[
                            Typography.description,
                            { textDecorationLine: 'line-through' },
                        ]}>
                        {toPriceFormat(item.original_price)}
                    </Text>
                        : <View style={{ height: 16 }} />
                }
            </View>
        </Ripple>
    );
};

const _Carousel = ({ data }: { data: ProductCollectionItem[] }) => {
    const navigator = useNavigator();
    const _renderItem = ({ item, index }: { item: ProductCollectionItem; index: number }) => {
        const onPress = () => {
            navigator.navigate(new ProductDetailRouteSetting({ productPk: item.pk }));
        };

        const image = getProductThumbnail(item);

        return (
            <>
                <Ripple
                    onPress={onPress}
                    rippleContainerBorderRadius={4}
                    style={styles.carouselItemContainer}>
                    <View style={{ width: '100%', height: 211 }}>
                        <Image source={{ uri: image, cache: 'force-cache' }}
                            style={styles.imageContainer} />
                    </View>
                    <View style={{ height: 8 }} />
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[Typography.description]}>{item.store}</Text>
                        <Text numberOfLines={1} style={[Typography.option]}>
                            {item.name}
                        </Text>
                        <Text style={[Typography.title, { textTransform: 'none' }]}>
                            {toPriceFormat(item.final_price())}
                        </Text>
                    </View>
                </Ripple>
                <View style={{ position: 'absolute', top: 24, right: 24 }}>
                    <ProductHeartButton data={item} />
                </View>
            </>
        );
    };

    return (
        <View style={{ height: 318 }}>
            <Carousel<ProductCollectionItem>
                inactiveSlideOpacity={1}
                inactiveSlideScale={0.75}
                firstItem={1}
                data={data}
                renderItem={_renderItem}
                sliderWidth={screen.width}
                itemWidth={182}
                itemHeight={318}
            />
        </View>
    );
};

export const ProductCollectionPlaceholder = () => {
    return (
        <CollectionContainerPlaceholder>
            <View style={{ height: 24 }} />
            <View style={{ paddingLeft: 16, flexDirection: 'row' }}>
                {range(5).map((_, index) => {
                    return (
                        <View style={styles.slideContainer} key={index}>
                            <PlaceholderMedia style={{ width: 93, flex: 1, backgroundColor: 'white' }} />
                        </View>
                    );
                })}
            </View>
        </CollectionContainerPlaceholder>
    );
};

const styles = StyleSheet.create({
    slideContainer: {
        width: 93 + 12,
        height: 170,
        paddingRight: 12,
        borderRadius: 4,
        overflow: 'hidden',
    },
    tag: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '75%',
        height: 25.88,
        position: 'absolute',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        bottom: 0,
        left: 0,
    },
    slideItemImage: {
        backgroundColor: Colors.background,
        flex: 1,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    carouselItemContainer: {
        height: 318,
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 12,
    },
    imageContainer: {
        flex: 1,
        borderRadius: 4,
        backgroundColor: Colors.background,
    },
});
