import { ProductInfo } from 'model';
import React from 'react';
import { FlatList, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Typography } from 'styles';
import theme from 'styles/legacy/theme.style';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import { ProductSmallBox } from './ProductBox';
import { Fade, Placeholder, PlaceholderLine, PlaceholderMedia } from "rn-placeholder";
import { titleContainerStyle } from "styles/legacy/common.style";
import { range } from "lodash";


interface Props {
    data: ProductInfo[];
    title: string,
    showMore?: () => void;
    containerStyle?: ViewStyle;
    simple?: boolean
};

/** @deprecated   **/
const ProductListHorizontal = ({ data, title, showMore, containerStyle, simple = true }: Props) => {
    const _keyExtractor = (item: ProductInfo, index: number) => item.pk + index.toString();
    const _renderItem = ({ item }: { item: ProductInfo }) => (
        <View style={{ paddingRight: 12 }}>
            <ProductSmallBox
                data={item}
            />
        </View>
    );

    const shouldDisplayShowMore = showMore && ((data?.length ?? 0) >= 20);

    return (
        <View style={containerStyle}>
            <View
                style={styles.titleContainer}>
                <Text style={styles.titleText} numberOfLines={1}>
                    {title}
                </Text>
                {shouldDisplayShowMore && (
                    <Button
                        innerHorizontalPadding={0}
                        text={'Xem tất cả'}
                        type={ButtonType.flat}
                        constraint={LayoutConstraint.wrapChild}
                        onPress={showMore}
                        textStyle={{ color: theme.PRIMARY_GRAY }}
                    />
                )}
            </View>
            <FlatList
                data={data}
                renderItem={_renderItem}
                keyExtractor={_keyExtractor}
                ListHeaderComponent={<View style={{ width: 16 }} />}
                horizontal
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={25000}
                showsHorizontalScrollIndicator={false}
                windowSize={4}
            />
        </View>
    );
};

export const ProductListHorizontalPlaceholder = () => {
    return <Placeholder Animation={Fade}>
        <View style={[styles.titleContainer, { paddingHorizontal: 16 }]}>
            <PlaceholderLine noMargin style={{ height: 18, width: 180, backgroundColor: 'white' }} />
            <PlaceholderLine noMargin style={{ height: 18, width: 80, backgroundColor: 'white' }} />
        </View>
        <View style={{ flexDirection: 'row', paddingLeft: 16 }}>
            {range(5).map(() => {
                return (<View style={{ height: 168, width: 96, marginRight: 10 }}>
                    <PlaceholderMedia style={{ height: 120, width: '100%', backgroundColor: 'white' }} />
                    <View style={{ height: 4 }} />
                    <PlaceholderLine noMargin style={{ height: 18, width: '40%', backgroundColor: 'white' }} />
                    <View style={{ height: 4 }} />
                    <PlaceholderLine noMargin style={{ height: 18, width: '80%', backgroundColor: 'white' }} />
                </View>)
            })}
        </View>
    </Placeholder>
}

export default ProductListHorizontal;

const styles = StyleSheet.create({
    titleText: { ...Typography.name_button, paddingLeft: 16 },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 12,
        paddingBottom: 12,
    }
});
