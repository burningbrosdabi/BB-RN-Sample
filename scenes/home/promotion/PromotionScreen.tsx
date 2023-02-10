import { Animation } from 'components/animation';
import { ImageElementFlex } from 'components/images/ImageElement';
import { ProductFilter } from 'components/list/product/filter';
import { List } from 'components/list/product/ProductList.v2';
import { FeatureDiscoveryContext } from 'components/tutorial/context';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { storeKey } from 'utils/constant';
import { numberWithDots } from 'utils/helper';
import { useAsync } from "utils/hooks/useAsync";
import { getDiscountBanner } from "_api";
import { BannerHeader, BannerRef } from "scenes/home/promotion/PromotionBanner";



const _Screen = () => {

    const [animationValue] = useState(new Animated.Value(0));
    const [animationTextValue] = useState(new Animated.Value(0));

    const { controller, fetch, count } = List.useHandler({ isDiscount: true });
    const { discover } = useContext(FeatureDiscoveryContext);
    const [title, setTitle] = useState('')

    // useEffect(() => {
    //     discover(storeKey.productListFeatureDiscovery);
    // }, []);


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


    return (

        <View style={{ flex: 1 }}>
            <Animation.Header title={title} animation={animationValue} />
            <List.Product
                fetch={fetch}
                controller={controller}
                HeaderComponent={
                    <>
                        <_Header
                            setTitle={setTitle}
                            count={count} />
                    </>
                }
            />
        </View>

    );
};

const _Header = ({ count, setTitle }: { count: number, setTitle: (value: string) => void }) => {
    const bannerRef = useRef<BannerRef>(null);

    useEffect(() => {
        bannerRef.current?.dataPromise.then((value) => {
            setTitle(value?.title ?? '');
        })
    }, [])

    return (
        <View>
            <BannerHeader disabled ref={bannerRef} showTitle />
            <View style={{ paddingHorizontal: 0, paddingVertical: 12, paddingTop: 12 }}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    orderingTab: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export const PromotionScreen = ProductFilter.HOC(_Screen);
