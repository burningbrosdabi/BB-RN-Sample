import { useRoute } from '@react-navigation/native';
import { Animation } from 'components/animation';
import { useGetOnScrollingAnimation } from "components/animation/Header";
import { ConnectionDetection } from 'components/empty/OfflineView';
import { Header } from 'components/header/Header';
import { ProductFilter } from 'components/list/product/filter';
import { CategoryRepoContext, defaultCatg } from 'components/list/product/filter/context';
import { List } from 'components/list/product/ProductList.v2';
import LoadingIndicator from 'components/loading/LoadingIndicator';
import { FeatureDiscoveryContext } from 'components/tutorial/context';
import { get } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Outlines, Typography } from 'styles';
import { storeKey } from 'utils/constant';
import { numberWithDots } from 'utils/helper';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';


const _Screen = () => {
    const { discover } = useContext(FeatureDiscoveryContext);
    const { anim, onScroll } = useGetOnScrollingAnimation();
    const { controller, fetch, count } = List.useHandler();
    const [animationValue] = useState(new Animated.Value(0));

    useEffect(() => {
        controller.onScroll = onScroll;
    }, [controller])

    controller.onScroll = (data) => {
        if (data.nativeEvent.contentOffset.y < 0) return;
        Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: {
                            y: animationValue,
                        },
                    },
                },
            ],
        )(data);
    };
    const { update, repo } = useContext(CategoryRepoContext);
    const route = useRoute();

    const [updateCount, setUpdateCount] = useState(0);

    const categoryFilter = get(route, 'params', { category: 'all', subCategory: 'all' }) as {
        category: string;
        subCategory: string;
    };

    const categories = useTypedSelector((state) => state.product.categories);

    // useEffect(() => {
    //     discover(storeKey.productListFeatureDiscovery);
    // }, []);

    useEffect(() => {
        const category =
            categories.find((catg) => catg.name === categoryFilter.category) ?? defaultCatg;

        const subCategory =
            category?.productsubcategory_set.find((catg) => catg.name === categoryFilter.subCategory) ??
            defaultCatg;

        update({
            category,
            subCategory,
        });
    }, [categoryFilter]);

    useEffect(() => {
        if (updateCount < 2) setUpdateCount(updateCount + 1);
    }, [repo, updateCount]);

    return (
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
            <ConnectionDetection.View>
                {updateCount < 2 ? (
                    <LoadingIndicator isLoading />
                ) : (
                    <List.Product
                        controller={controller}
                        fetch={fetch}
                        fixedHeaderComponent={<Header titleComponent={<ProductFilter.CategoryBtn />} />}
                        HeaderComponent={<_Header count={count} />}
                    />
                )}
            </ConnectionDetection.View></SafeAreaView>
    );
};


const _Header = ({ count }: { count: number }) => {
    return (
        <View style={{ width: '100%', height: 28 + 12 * 2 + 36 }}>
            <View style={{ height: 12 }} />
            <ProductFilter.ActionGroup />
            <View style={{
                borderBottomWidth: Outlines.borderWidth.base,
                borderBottomColor: Colors.line,
                marginTop: 12, marginBottom: 11
            }} />
            <View style={styles.orderingTab}>
                <Text style={Typography.description}>{numberWithDots(count)} kết quả </Text>
                <ProductFilter.OrderingBtn />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    orderingTab: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export const ProducCategoryFilterScreen = ProductFilter.HOC(_Screen);
