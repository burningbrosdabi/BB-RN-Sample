import { Link } from 'components/button/Link';
import { get, isEmpty } from 'lodash';
import { Collection, CollectionType, ItemTransition } from 'model/collection/collection';
import React, { useMemo } from 'react';
import { ImageRequireSource, Text, View, ImageBackground, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import { LandingRouteSetting } from 'routes/collection/collection.route';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';

export const getCollectionDefaultStyle = (
    type: CollectionType,
    transition: ItemTransition,
): {
    image: ImageRequireSource;
    gradient: string[];
} => {
    switch (type) {
        case CollectionType.flash_sale:
            return {
                image: require('/assets/images/collection/flash.png'),
                gradient: ['#FCD986', '#FDE4A6'],
            };

        case CollectionType.product:
            if (transition === ItemTransition.slide) {
                return {
                    image: require('/assets/images/collection/product.png'),
                    gradient: Colors.gradient.purple,
                };
            }
            return {
                image: require('/assets/images/collection/carousel.png'),
                gradient: Colors.gradient.green,
            };
        case CollectionType.store:
        default:
            return {
                image: require('/assets/images/collection/store.png'),
                gradient: Colors.gradient.blue,
            };
    }
};

export const CollectionContainer = ({
    data,
    children,
}: {
    data: Collection;
    children: JSX.Element[] | false | Element;
}) => {
    const navigator = useNavigator();
    const { title, background_image: image, color = '#FFFFFF' } = data;
    const { gradient, image: defaultImage } = useMemo(() => {
        return getCollectionDefaultStyle(data.type, data.item_transition);
    }, []);
    const showAll = get(data, 'items.length', 0) >= 15;

    const onPress = () => {
        navigator.navigate(new LandingRouteSetting({ type: data.type, id: data.id }));
    };
    const child = (
        <>
            <View style={styles.titleContainer}>
                <View style={{ flex: 1 }}>
                    <Text
                        numberOfLines={2}
                        style={[
                            Typography.title,
                            { color }
                        ]}>
                        {title}
                    </Text>
                </View>
                <Link
                    style={{ textDecorationLine: 'none' }}
                    text={'Xem tất cả'}
                    onPress={onPress}
                    blurColor={color}
                />
            </View>
            {children}
        </>
    );

    if (!isEmpty(image)) {
        return (
            <ImageBackground
                resizeMode="cover"
                source={{ uri: image, cache: 'force-cache' }}
                style={styles.collectionContainer}>
                {child}
            </ImageBackground>
        );
    }

    return (
        <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0.1 }}
            colors={gradient}
            style={styles.collectionContainer}>
            <Image
                resizeMode={'contain'}
                source={defaultImage}
                style={{ position: 'absolute', right: 0, top: 0 }}
            />
            {child}
        </LinearGradient>
    );
};

export const CollectionContainerPlaceholder = ({ children }: { children: JSX.Element[] }) => {
    return (
        <View style={[styles.collectionContainer, { backgroundColor: Colors.background }]}>
            <Placeholder Animation={Fade}>
                <View style={{ paddingHorizontal: 16 }}>
                    <PlaceholderLine
                        noMargin
                        style={{ height: 26, width: '80%', backgroundColor: 'white' }}
                    />
                    <View style={{ height: 4 }} />
                    <PlaceholderLine
                        noMargin
                        style={{ height: 26, width: '60%', backgroundColor: 'white' }}
                    />
                </View>
                {children}
            </Placeholder>
        </View>
    );
};

const styles = StyleSheet.create({
    collectionContainer: {
        paddingTop: 24,
        paddingBottom: 36,
        borderRadius: 12,
        backgroundColor: Colors.background,
        overflow: 'hidden',
    },
    titleContainer: { flexDirection: 'row', paddingLeft: 16, paddingRight: 4 },
});
