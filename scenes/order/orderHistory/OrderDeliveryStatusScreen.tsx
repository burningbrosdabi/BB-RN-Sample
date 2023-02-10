import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import HandledError from 'error/error';
import { OrderItem, OrderProductItem } from 'model';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RoutePath } from 'routes';
import { getOrderDetailApi } from 'services/api/order/order.api';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { fontExtraBold, fontRegular } from 'styles/typography';
import { toPriceFormat } from 'utils/helper';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useActions } from 'utils/hooks/useActions';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import { ConnectionDetection } from 'components/empty/OfflineView';
import ProfileImage from 'components/images/ProfileImage';
import ImageElement from 'components/images/ImageElement';
import { Header } from 'components/header/Header';
import { ProductOrderInfo } from 'components/list/order/ProductOrderInfo';

interface OrderDeliveryStatusProps {
  navigation: any;
  route: {
    params: {
      data?: OrderItem;
      id?: string;
    };
  };
}

const OrderDeliveryStatusScreen = ({ navigation, route }: OrderDeliveryStatusProps) => {
  const { data: _data, id } = route.params;
  const [isExpand, setIsExpand] = useState(false);
  const { showDialog } = useActions();

  const { data, excecute, state, error } = useAsync<OrderItem>(() =>
    !id ? Promise.resolve(_data!) : getOrderDetailApi(id),
  );

  useEffect(() => {
    excecute();
  }, []);

  useEffect(() => {
    if (!error) return;
    const _error = new HandledError({
      error: error as Error,
      stack: 'OrderDeliveryStatusScreen.useEffect[error]',
    });
    _error.log(true);

    showDialog({
      title: 'Không thể lấy thông tin vận chuyển',
      description: _error.friendlyMessage,
      actions: [
        {
          text: 'Quay về',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    });
  }, [error]);

  const onStorePress = () => {
    navigation.navigate('StoreDetail', { store: data?.store });
  };

  const onProductDetailPress = (product: any) => {
    navigation.push(RoutePath.productDetail, { productPk: product?.product_pk });
  };

  const _renderPrice = ({
    product_is_discount,
    option_original_price,
    option_discount_price,
    option_discount_rate,
  }: OrderProductItem) => {
    return (
      <View>
        {product_is_discount ? (
          <Text style={Typography.body}>
            <Text
              style={[
                Typography.description,
                {
                  color: Colors.primary,
                  fontFamily: fontExtraBold,
                },
              ]}>
              -{option_discount_rate}%{' '}
            </Text>
            {toPriceFormat(option_discount_price)}
          </Text>
        ) : (
          <Text style={Typography.body}>{toPriceFormat(option_original_price)}</Text>
        )}
      </View>
    );
  };

  return (
    <ConnectionDetection.View>
      <>
        <SafeAreaView>
          <Header />
        </SafeAreaView>
        {state === ConnectionState.hasData && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50 }}>
            <View style={styles.container}>
              {/* Title */}
              <View
                style={[
                  styles.horizontalPadding,
                  {
                    paddingBottom: 12,
                    marginVertical: 12,
                    borderBottomWidth: Outlines.borderWidth.medium,
                    borderColor: Colors.background,
                  },
                ]}>
                <Text style={styles.titleText}>{'Chi tiết vận chuyển'}</Text>
                <Text style={styles.descriptionTex}>{`Mã đơn hàng: ${data?.code}`}</Text>
              </View>
              {/* Store Info */}
              <View
                style={[
                  styles.rowSpaceContainer,
                  styles.horizontalPadding,
                  {
                    marginBottom: isExpand ? 12 : 0,
                    paddingBottom: 12,
                    borderBottomWidth: isExpand ? 0 : Outlines.borderWidth.medium,
                    borderColor: Colors.background,
                  },
                ]}>
                <TouchableOpacity
                  onPress={onStorePress}
                  style={[styles.rowContainer, { width: Spacing.screen.width - 32 - 80 }]}>
                  <ProfileImage size={40} source={data?.store?.profile_image} />
                  <View style={{ width: Spacing.screen.width - 32 - 80 - 40 - 12, marginLeft: 12 }}>
                    <View style={[styles.rowContainer]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          ...Typography.name_button,
                          textTransform: 'none',
                          maxWidth: Spacing.screen.width - 32 - 80 - 40 - 12 - 12,
                          marginRight: 4,
                        }}>
                        {data?.store?.insta_id}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <Button
                  type={ButtonType.flat}
                  alignItems={'center'}
                  constraint={LayoutConstraint.wrapChild}
                  postfixIcon={isExpand ? 'small_arrow_up' : 'small_arrow_down'}
                  text={(data?.order_items.length || 0) + ' sản phẩm'}
                  onPress={() => setIsExpand(!isExpand)}
                  textStyle={{ ...styles.descriptionTex, marginRight: 4, paddingLeft: 0 }}
                  innerHorizontalPadding={0}
                  style={{ alignSelf: 'center' }}
                />
              </View>
              {/* Product Infor */}
              {isExpand && (
                <View style={styles.productContainer}>
                  {data!.order_items.map((product: OrderProductItem) => {
                    const {
                      option_color = '',
                      option_size = '',
                      option_extra_option = '',
                    } = product;
                    const productOption = [option_color, option_size, option_extra_option].filter(
                      res => res,
                    );
                    return (
                      <View style={{ marginTop: 12 }}>
                        <ProductOrderInfo
                          product={product}
                          onPress={() => onProductDetailPress(product)}
                          hasBottomAction={false}
                        />
                      </View>
                    );
                  })}
                </View>
              )}
              {/* Delivery Info */}
              <View style={[styles.rowSpaceContainer, styles.deliveryInfoContainer]}>
                <View style={{}}>
                  <Text
                    style={{
                      ...Typography.title,
                      color: Colors.primary,
                      textTransform: 'none',
                    }}>
                    {data?.order_delivery.delivery_vendor_name}
                  </Text>
                  {data?.order_delivery.lead_time &&
                    moment(data?.order_delivery.lead_time).isValid() ? (
                    <Text
                      style={{
                        ...Typography.name_button,
                        color: Colors.primary,
                        textTransform: 'none',
                      }}>
                      {'Ngày dự kiến giao hàng: ' +
                        moment(data?.order_delivery.lead_time).format('DD MMM')}
                    </Text>
                  ) : undefined}
                </View>
              </View>
              <View style={styles.horizontalPadding}>
                {data?.order_delivery.shipping_id ? (
                  <Text
                    style={
                      styles.descriptionTex
                    }>{`Mã vận đơn: ${data?.order_delivery.shipping_id}`}</Text>
                ) : undefined}
              </View>
            </View>
          </ScrollView>
        )}
      </>
    </ConnectionDetection.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  horizontalPadding: {
    paddingHorizontal: 16,
  },
  titleText: {
    ...Typography.h1,
  },
  descriptionTex: {
    ...Typography.description,
    fontFamily: fontRegular,
    textTransform: 'none',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productContainer: {
    paddingHorizontal: 16,
    marginTop: -12,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
  },
  productItemContainer: {
    flexDirection: 'row',
    marginBottom: 12,
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
  priceText: {
    ...Typography.body,
    textTransform: 'none',
    color: Colors.surface.darkGray,
  },
  iconShipping: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  priceContainer: {
    marginTop: 4,
  },
  deliveryInfoContainer: {
    paddingBottom: 12,
    marginTop: 12,
    paddingHorizontal: 16,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
  },
});

export default React.memo(OrderDeliveryStatusScreen);
