import { OrderProductItem } from 'model';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { fontExtraBold } from 'styles/typography';
import ImageElement from 'components/images/ImageElement';
import React from 'react';
import { toPriceFormat } from '_helper';
import { isNil } from "lodash";

export const ProductOrderInfo = ({
  product,
  onPress,
  total,
  hasBottomAction = false,
}: {
  product: OrderProductItem;
  onPress: () => void;
  total?: number;
  hasBottomAction: boolean;
}) => {
  const { option_color = '', option_size = '', option_extra_option = '' } = product || {};
  const productOption = [option_color, option_size, option_extra_option].filter(res => res);
  const _renderPrice = ({
    option_original_price,
    option_discount_price,
    option_discount_rate,
  }: OrderProductItem) => {
    const is_discount = option_discount_price > 0;
    return (
      <View>
        {is_discount ? (
          <Text style={Typography.body}>
            <Text
              style={[
                Typography.description,
                {
                  color: Colors.primary,
                  fontFamily: fontExtraBold,
                },
              ]}>
              -{option_discount_rate || 0}%{' '}
            </Text>
            {toPriceFormat(option_discount_price || 0)}
          </Text>
        ) : (
          <Text style={Typography.body}>{toPriceFormat(option_original_price)}</Text>
        )}
      </View>
    );
  };

  return (
    <View>
      {/* Product Infor */}
      <View style={styles.rowContainer}>
        {product ? (
          <TouchableOpacity style={styles.productContainer} onPress={onPress}>
            <ImageElement
              sourceURL={product.product_product_thumbnail_image}
              width={74}
              height={92}
              rounded
            />
            <View style={styles.productTextContainer}>
              {product.product_is_new ? (
                <Text numberOfLines={1} style={[styles.productName, { color: Colors.primary }]}>
                  {'NEW '}
                  <Text style={styles.productName} numberOfLines={1}>
                    {product.product_name}
                  </Text>
                </Text>
              ) : (
                <Text style={styles.productName} numberOfLines={1}>
                  {product.product_name}
                </Text>
              )}
              <Text style={styles.productDescription} numberOfLines={1}>
                {productOption.filter(Boolean).join(' / ')}
              </Text>
              {product.option_discount_price > 0 ? (
                <Text
                  style={[
                    Typography.description,
                    {
                      textDecorationLine: 'line-through',
                      textAlign: 'right',
                      marginTop: 12,
                    },
                  ]}>
                  {toPriceFormat(product.option_original_price)}
                </Text>
              ) : (
                <View style={{ flex: 1 }} />
              )}
              <View
                style={[
                  styles.rowSpaceContainer,
                  {
                    width: Spacing.screen.width - 32 - 74 - 12,
                    marginTop: product.product_is_discount ? 0 : 24,
                    marginBottom: 0,
                  },
                ]}>
                <Text style={styles.priceText}>{`SL: ${product.quantity}`}</Text>
                <View style={styles.priceContainer}>{_renderPrice(product)}</View>
              </View>
            </View>
          </TouchableOpacity>
        ) : undefined}
      </View>
      {/* Product Price */}
      {!isNil(total) && (
        <View
          style={[
            styles.rowContainer,
            {
              justifyContent: 'flex-end',
              height: 48,
              marginBottom: hasBottomAction ? 0 : -12,
              borderBottomWidth: hasBottomAction ? Outlines.borderWidth.base : 0,
              borderColor: Colors.background,
            },
          ]}>
          <Text style={styles.priceText}>{'Thành tiền '}</Text>
          <Text
            style={[
              styles.priceText,
              {
                color: Colors.primary,
                fontFamily: fontExtraBold,
              },
            ]}>
            {toPriceFormat(total)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productContainer: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: Outlines.borderWidth.base,
    borderColor: Colors.background,
  },

  productTextContainer: {
    width: Spacing.screen.width - 32 - 74 - 12,
    marginLeft: 12,
  },

  productName: {
    ...Typography.name_button,
    textTransform: 'none',
  },
  productDescription: {
    ...Typography.body,
    textTransform: 'none',
    color: Colors.surface.darkGray,
  },
  rowSpaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    ...Typography.body,
    textTransform: 'none',
    color: Colors.surface.darkGray,
  },
  priceContainer: {
    marginTop: 4,
  },
});
