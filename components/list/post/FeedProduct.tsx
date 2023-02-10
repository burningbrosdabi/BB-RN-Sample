import ImageElement from 'components/images/ImageElement';
import React, { useMemo, useState } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { RoutePath } from 'routes';
import { applyOpacity, Colors, Outlines, Spacing, Typography } from 'styles';
import { toPriceFormat } from 'utils/helper';
import { getProductThumbnail, stringTruncate } from "_helper";
import { RelatedProduct, RelatedProductSourceType } from "model/product/related.product";
import { useNavigation } from "@react-navigation/native";
import { isNil } from "lodash";
import { DabiFont } from 'assets/icons';
import Ripple from 'react-native-material-ripple';
import { borderWidth } from 'styles/outlines';


const FeedProduct = ({
    data,
    containerStyle,
    ProductText,
    onPress,
}: { data: RelatedProduct, containerStyle?: ViewStyle, ProductText?: JSX.Element, onPress?: () => void }) => {


    const {
        pk = 0,
        store = '',
        name = '',
        discount_rate = 0,
        discount_price = 0,
        original_price = 0,
        size,
        color,
        extra_option,
        stock_available, product_source
    } = data ?? {};

    const image = useMemo(() => {
        return getProductThumbnail(data);
    }, [data])

    const _renderLandingButton = () => {
        let iconSource, boxColor
        switch (product_source) {
            case RelatedProductSourceType.INSTAGRAM:
                iconSource = require('/assets/images/social/Insta/Instagram_W.png')
                boxColor = Colors.black
                break
            case RelatedProductSourceType.SHOPEE:
                iconSource = require('/assets/images/social/Shopee/W.png')
                boxColor = Colors.black
                break
            default:
                iconSource = require('/assets/images/social/Homepage/Homepage_W.png')
                boxColor = Colors.black
        }

        return <View style={{ backgroundColor: boxColor, flexDirection: 'row', padding: 8, borderRadius: 30 }}>
            <Image source={iconSource} style={{ width: 12, height: 12 }} />
            <View style={{ width: 4 }} />
            <DabiFont name={'small_arrow_right'} color={Colors.white} size={12} />
        </View>
    }

    const _renderSoldout = () => {
        const [showSoldout, setShowSoldout] = useState(false)

        return <View style={{ paddingLeft: 4, flex: 1 }}>
            <View style={{ alignItems: 'flex-start' }}>
                <Ripple onPress={() => { setShowSoldout(!showSoldout) }}>
                    <DabiFont name={'small_soldout'} color={Colors.component} size={12} />
                </Ripple></View>
            {showSoldout && <View style={{
                position: 'absolute',
                top: 22 + 1, left: -24,
            }}><Ripple
                onPress={() => {
                    setShowSoldout(!showSoldout)
                }}
                style={{
                    backgroundColor: applyOpacity(Colors.black, 0.93),
                    paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, zIndex: 10
                }}>
                    <Text style={{ ...Typography.mark, color: Colors.white, }}>Hết hàng</Text>
                    <Text style={{ ...Typography.description, color: Colors.white }}>Rất khó để mua sản phẩm này bây giờ</Text>
                    <View style={styles.messageBoxArrow} />
                </Ripple>
            </View>}
        </View>
    }
    return (
        <TouchableOpacity
            style={[{
                paddingHorizontal: 12,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
            }, containerStyle]}
            onPress={() => {
                onPress && onPress();
            }}>
            <ImageElement
                sourceURL={image}
                width={48}
                height={60}
                rounded
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
                {!isNil(color || size || extra_option) && <Text style={{ ...Typography.description, color: Colors.red }} numberOfLines={1}>{size && 'Size ' + size}
                    {color && size && ', '}
                    {color ?? ''}
                    {isNil(size) && isNil(color) && extra_option}
                </Text>}
                <View></View>
                <Text style={Typography.mark} numberOfLines={1}>
                    {stringTruncate(store, 30)}{'  '}
                    {
                        !isNil(ProductText) ? ProductText :
                            <Text style={Typography.description} numberOfLines={1}>
                                {name}
                            </Text>
                    }
                </Text>
                <View style={{ height: 4 }} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Text style={Typography.mark}>
                        {discount_rate ? (
                            <>
                                <Text style={{ ...Typography.description, color: Colors.red }}>-{discount_rate}% </Text>
                                {discount_price
                                    ? toPriceFormat(discount_price)
                                    : ''}</>
                        ) : (
                            <>{
                                original_price
                                    ? toPriceFormat(original_price)
                                    : ''
                            }</>
                        )}
                    </Text>{stock_available ? <></> : _renderSoldout()}

                </View>
            </View>
            <View style={{ width: 12 }} />
            {_renderLandingButton()}
        </TouchableOpacity>
    );
};

export default FeedProduct;

const styles = StyleSheet.create({

    messageBoxArrow: {
        position: 'absolute',
        top: -8,
        left: 26,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 8,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: applyOpacity(Colors.black, 0.93),
    },
})