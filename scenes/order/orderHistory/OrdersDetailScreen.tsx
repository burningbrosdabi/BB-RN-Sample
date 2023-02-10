import { VoucherIcon } from 'assets/icons/common';
import DabiFont from 'assets/icons/dabi.fonts';
import { toast } from 'components/alert/toast';
import { Button, ButtonState, ButtonType, LayoutConstraint } from 'components/button/Button';
import { ConnectionDetection } from 'components/empty/OfflineView';
import ImageElement from 'components/images/ImageElement';
import ProfileImage from 'components/images/ProfileImage';
import SafeAreaWithHeader from 'components/view/SafeAreaWithHeader';
import { HandledError } from 'error';
import { OrderItem, OrderProductItem } from 'model';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import StepIndicator from 'react-native-step-indicator';
import { RoutePath } from 'routes';
import RecipientItem from 'scenes/profile/recipients/RecipientItem';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { fontExtraBold, fontRegular } from 'styles/typography';
import { toPriceFormat } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { orderStatusTranslation } from 'utils/translations';
import { cancelOrderApi, completeOrderApi, getOrderDetailApi, productFeedbackStream } from '_api';
import { contactWithShop, HEADER_HEIGHT } from '_helper';
import CancelOrderModal from './CancelOrderModal';
import { useNavigation } from '@react-navigation/native';

interface OrderDetailProps {
  route: {
    params: {
      id: string;
    };
  };
}

const OrderDetailScreen = ({ route }: OrderDetailProps) => {
  const { id } = route.params;

  const { setLoading, showDialog } = useActions();
  const navigation = useNavigation();
  const [isExpand, setIsExpand] = useState(true);

  const { cancelReasons } = useTypedSelector(state => state.order);
  const { userInfo } = useTypedSelector(state => state.user);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { state, data, excecute, error } = useAsync<OrderItem>(() => getOrderDetailApi(id));
  const order_items = data && data.order_items ? data.order_items : [];

  useEffect(() => {
    setLoading(true);
    excecute().finally(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!error) return;
    const handledError = new HandledError({
      error,
      stack: 'OrderList.getOrderDetail',
    });
    showDialog({
      title: handledError.friendlyMessage,
      actions: [
        {
          type: ButtonType.primary,
          text: 'Ok',
          onPress: () => { },
        },
      ],
    });
    handledError.log(true);
  }, [error]);

  const toogleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const onStorePress = () => {
    // @ts-ignore
    navigation.navigate('StoreDetail', { store: data?.store });
  };

  const onStoreChatPress = async () => {
    // Linking.openURL('https://www.instagram.com/' + data?.store?.insta_id);
    if (!data?.store?.facebook_numeric_id) {
      toast('Không thể liên hệ với cửa hàng');
      return;
    }
    const contact = await contactWithShop(data.store.facebook_numeric_id);
    contact();
  };

  const onProductDetailPress = (product: any) => {
    navigation.push(RoutePath.productDetail, { productPk: product?.product_pk });
  };

  const onCompletedOrder = async () => {
    try {
      setLoading(true);
      const result = data && (await completeOrderApi(data?.pk));
      const newOrder = {
        ...data,
        order_status_id: 5,
        delivered_at: moment().format(),
        order_status: 'delivered',
      };

      setLoading(false);
      toast('Đơn hàng của bạn đã được cập nhật');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => { },
          },
        ],
      });
    }
  };

  const onCancelOrder = async (item: any, message?: string) => {
    try {
      setLoading(true);
      toogleModal();
      const result =
        data && (await cancelOrderApi(data?.pk, { reason: item?.id + '', message: message }));
      const newOrder = {
        ...data,
        order_status_id: 6,
        canceled_at: moment().format(),
        order_status: 'canceled',
      };
      setLoading(false);
      toast('Đơn hàng của bạn đã được cập nhật');
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => { },
          },
        ],
      });
    }
  };

  const openCancelModal = () => {
    toogleModal();
  };

  const onExchangeRefundPress = () => {
    navigation.push(RoutePath.ordersRefundExchangScreen, { data: data });
  };

  const onDeliveryStatusPress = () => {
    navigation.push(RoutePath.orderDeliveryStatusScreen, { data: data });
  };

  const _labels = [
    ...new Set(Object.values(orderStatusTranslation).map((item: any) => item.traslation)),
  ];
  // 0: "Chờ xác nhận"
  // 1: "Chờ lấy hàng"
  // 2: "Đang giao"
  // 3: "Đã giao"
  // 4: "Đã hủy"
  // 5: "Yêu cầu hoàn tiền"
  // 6: "Đã hoàn tiền"
  // 7: "Đã chờ đổi hàng"
  // 8: "Đã xử lý"
  const status_id = data?.order_status_id || 0;
  const _originLabelIndex = _labels.findIndex(
    res => res === orderStatusTranslation[status_id]?.traslation,
  );
  let renderLables = [];
  let renderLabelIndex = 0;
  if (_originLabelIndex < 4) {
    renderLables = _labels.slice(0, 4);
    renderLabelIndex = _originLabelIndex;
  } else if (_originLabelIndex == 4) {
    renderLables = _labels.slice(4, 5);
    renderLabelIndex = _originLabelIndex - 4;
  } else if (_originLabelIndex <= 6) {
    renderLables = _labels.slice(5, 7);
    renderLabelIndex = _originLabelIndex - 5;
  } else {
    renderLables = _labels.slice(7, 9);
    renderLabelIndex = _originLabelIndex - 7;
  }

  const _renderPrice = ({
    product_is_discount,
    option_original_price,
    option_discount_price,
    option_discount_rate,
  }: OrderProductItem) => {
    return (
      <View>
        {option_discount_rate > 0 ? (
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

  const renderStepLabel = ({
    position,
    stepStatus,
    label,
    currentPosition,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    let time;
    // 0: "Chờ xác nhận"
    // 1: "Chờ lấy hàng"
    // 2: "Đang giao"
    // 3: "Đã giao"
    // 4: "Đã hủy"
    // 5: "Yêu cầu hoàn tiền"
    // 6: "Đã hoàn tiền"
    // 7: "Đã chờ đổi hàng"
    // 8: "Đã xử lý"
    switch (position) {
      case 0:
        time = data?.created;
        if (_originLabelIndex == 4) {
          time = data?.cancelled_at;
        } else if (_originLabelIndex >= 7) {
          time = data?.change_requested_at;
        }
        break;
      case 1:
        time = data?.confirmed_at;
        if (_originLabelIndex == 8) {
          time = data?.change_completed_at;
        }
        break;
      case 2:
        time = data?.delivering_at;
        break;
      case 3:
        time = data?.delivered_at || data?.completed_at;
        break;
      default:
        break;
    }
    const textTime = time && moment(time).isValid() ? moment(time).format('DD-MM-YYYY') : '';
    return (
      <View style={[styles.rowContainer, { marginLeft: 8 }]}>
        <Text
          style={[
            position == currentPosition ? Typography.h1 : Typography.name_button,
            { color: position <= currentPosition ? Colors.primary : Colors.surface.darkGray },
          ]}>
          {label}{' '}
        </Text>
        {position <= currentPosition && textTime ? (
          <Text style={styles.descriptionTex}>{textTime}</Text>
        ) : undefined}
      </View>
    );
  };

  return (
    <ConnectionDetection.View>
      <SafeAreaWithHeader chatIcon>
        {state === ConnectionState.hasData && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 50, paddingTop: HEADER_HEIGHT }}>
            <View style={styles.container}>
              {/* Title */}
              <View style={styles.horizontalPadding}>
                <Text style={styles.titleText}>{'Chi tiết đơn hàng'}</Text>
                <Text style={styles.descriptionTex}>{`Mã đơn hàng: ${data?.code}`}</Text>
              </View>
              {/* Step indicator */}
              <View style={styles.stepIndicatorContainer}>
                <StepIndicator
                  customStyles={customStyles}
                  stepCount={renderLables.length}
                  direction="vertical"
                  currentPosition={renderLabelIndex || 0}
                  renderStepIndicator={() => <View />}
                  labels={renderLables}
                  renderLabel={renderStepLabel}
                  stepContainerStyle={{ marginVertical: 12 }}
                  stepLabelItemContainer={{ height: 40 }}
                />
              </View>
              {/* Store Info */}
              <View
                style={[
                  styles.rowSpaceContainer,
                  styles.horizontalPadding,
                  {
                    marginBottom: isExpand ? 12 : 0,
                    paddingBottom: 12,
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
                    <Text style={{ ...Typography.description, color: Colors.primary }}>
                      {orderStatusTranslation[data?.order_status_id || 0]?.traslation}
                    </Text>
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
                  {order_items.map((product: OrderProductItem) => {
                    const {
                      option_color = '',
                      option_size = '',
                      option_extra_option = '',
                    } = product;
                    const productOption = [option_color, option_size, option_extra_option].filter(
                      res => res,
                    );
                    return (
                      <View key={product.pk}>
                        <TouchableOpacity
                          style={styles.productItemContainer}
                          onPress={() => onProductDetailPress(product)}>
                          <ImageElement
                            sourceURL={product.product_product_thumbnail_image}
                            width={74}
                            height={92}
                            rounded
                          />
                          <View style={styles.productTextContainer}>
                            <View style={styles.rowContainer}>
                              {product.is_exchanged ? (
                                <LinearGradient
                                  useAngle
                                  angle={271}
                                  colors={Colors.gradient.pink}
                                  style={styles.exchangeView}>
                                  <Text
                                    style={{
                                      ...Typography.description,
                                      color: Colors.white,
                                    }}>
                                    {'Trả hàng'}
                                  </Text>
                                </LinearGradient>
                              ) : undefined}
                              {product.product_is_new ? (
                                <Text
                                  numberOfLines={1}
                                  style={[styles.productName, { color: Colors.primary }]}>
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
                            </View>
                            <Text style={styles.productDescription} numberOfLines={1}>
                              {productOption.filter(Boolean).join(' / ')}
                            </Text>
                            {product.option_discount_rate > 0 ? (
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
                        {_originLabelIndex == 3 ? (
                          <View style={[styles.rowContainer, { marginBottom: 12 }]}>
                            <Button
                              type={ButtonType.outlined}
                              state={ButtonState.idle}
                              onPress={() => onProductDetailPress(product)}
                              text={'Mua lại'}
                              style={{ marginRight: 12 }}
                            />
                            <RatingButton data={data} product={product} />
                          </View>
                        ) : undefined}
                      </View>
                    );
                  })}
                </View>
              )}
              {/* Order action */}
              {_originLabelIndex <= 2 ? (
                <View style={[styles.rowContainer, styles.horizontalPadding, { marginBottom: 12 }]}>
                  {_originLabelIndex <= 1 && (
                    <Button
                      type={ButtonType.outlined}
                      state={ButtonState.idle}
                      prefixIcon={
                        _originLabelIndex <= 1 ? (
                          <View style={{ marginRight: 4 }}>
                            <DabiFont size={22} name={'chat'} color={Colors.primary} />
                          </View>
                        ) : undefined
                      }
                      onPress={onStoreChatPress}
                      text={'Chat'}
                      style={{ marginRight: 12 }}
                    />
                  )}
                  <Button
                    type={ButtonType.primary}
                    state={ButtonState.idle}
                    onPress={_originLabelIndex <= 1 ? openCancelModal : onCompletedOrder}
                    text={_originLabelIndex <= 1 ? 'Hủy đơn ' : 'Đã nhận hàng'}
                  />
                </View>
              ) : undefined}
              {_originLabelIndex > 1 ? (
                <View
                  style={[
                    styles.rowContainer,
                    styles.horizontalPadding,
                    {
                      paddingBottom: 12,
                      borderBottomWidth: _originLabelIndex == 4 ? Outlines.borderWidth.medium : 0,
                      borderColor: Colors.background,
                    },
                  ]}>
                  <Button
                    type={ButtonType.outlined}
                    state={ButtonState.idle}
                    prefixIcon={
                      <View style={{ marginRight: 12 }}>
                        <DabiFont size={21} name={'chat'} color={Colors.primary} />
                      </View>
                    }
                    onPress={onStoreChatPress}
                    text={'Chat với shop'}
                  />
                </View>
              ) : undefined}
              {/* Delivery Info */}
              {_originLabelIndex != 4 && (
                <Button
                  type={ButtonType.option}
                  state={ButtonState.focused}
                  text={data?.order_delivery.delivery_vendor_name}
                  postfixIcon={'small_arrow_right'}
                  iconColor={Colors.primary}
                  postfixText={'Xem chi tiết'}
                  alignItems={'flex-start'}
                  onPress={onDeliveryStatusPress}
                  childContainerStyle={{ justifyContent: 'space-between', width: '100%' }}
                  style={{ marginHorizontal: 16, marginBottom: 0 }}
                />
              )}
              {_originLabelIndex != 4 && (
                <View style={[styles.rowSpaceContainer, styles.deliveryInfoContainer]}>
                  <View style={styles.rowContainer}>
                    <Image
                      style={styles.iconShipping}
                      source={require('_assets/images/icon/info_shipping.png')}
                    />
                    {data?.order_delivery.lead_time &&
                      moment(data?.order_delivery.lead_time).isValid() ? (
                      <Text
                        style={{
                          ...Typography.description,
                          color: Colors.primary,
                          marginLeft: 12,
                        }}>
                        {moment(data?.order_delivery.lead_time).format('DD MMM')}
                      </Text>
                    ) : undefined}
                  </View>
                  {data?.order_delivery.shipping_id ? (
                    <Text
                      style={
                        styles.descriptionTex
                      }>{`Mã vận đơn: ${data?.order_delivery.shipping_id}`}</Text>
                  ) : undefined}
                </View>
              )}
              {/* Address Info */}
              {data && _originLabelIndex != 4 && data.shipping_address?.contact_number ? (
                <View style={styles.horizontalPadding}>
                  <RecipientItem canEdit={false} data={data.shipping_address} />
                </View>
              ) : undefined}
              {/* Payment Info */}
              {_originLabelIndex != 4 && (
                <LinearGradient
                  useAngle
                  angle={180}
                  colors={Colors.gradient.purple}
                  style={styles.paymentContainer}>
                  <View style={styles.rowContainer}>
                    <Image
                      style={styles.iconShipping}
                      source={require('_assets/images/icon/icon_COD.png')}
                    />
                    <Text style={styles.paymentMethod}>
                      {data?.order_payment.payment_method_name}
                    </Text>
                  </View>
                  <Text style={styles.paymentDescription}>{'Thanh toán khi nhận hàng'}</Text>
                </LinearGradient>
              )}
            </View>
            {/* Price calculation Info */}
            {_originLabelIndex != 4 && (
              <View style={styles.priceCalContainer}>
                <View style={styles.rowSpaceContainer}>
                  <Text style={styles.descriptionTex}>{'Tổng tiền hàng'}</Text>
                  <Text
                    style={{
                      ...Typography.name_button,
                      textTransform: 'none',
                    }}>
                    {toPriceFormat(data?.sub_total || 0)}
                  </Text>
                </View>
                <View style={[styles.rowSpaceContainer, { marginBottom: 0 }]}>
                  <Text style={styles.descriptionTex}>{'Chi phí vận chuyển'}</Text>
                  <Text
                    style={{
                      ...Typography.name_button,
                      textTransform: 'none',
                    }}>
                    {toPriceFormat(data?.shipping_fee || 0)}
                  </Text>
                </View>
                {data?.total_discounted ? (
                  <View style={[styles.rowSpaceContainer, { marginBottom: 0, marginTop: 12 }]}>
                    <View style={styles.rowContainer}>
                      <VoucherIcon size={22} />
                      <Text
                        style={[
                          Typography.description,
                          {
                            color: Colors.primary,
                            fontFamily: fontRegular,
                            marginLeft: 4,
                          },
                        ]}>
                        {'Giảm giá'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        Typography.name_button,
                        {
                          color: Colors.primary,
                          textTransform: 'none',
                        },
                      ]}>
                      {toPriceFormat(data?.total_discounted || 0)}
                    </Text>
                  </View>
                ) : undefined}
              </View>
            )}
            {_originLabelIndex != 4 && (
              <View
                style={[
                  styles.rowContainer,
                  styles.horizontalPadding,
                  {
                    justifyContent: 'flex-end',
                    height: 48,
                  },
                ]}>
                <Text style={styles.descriptionTex}>{'Thành tiền '}</Text>
                <Text
                  style={[
                    Typography.h1,
                    {
                      color: Colors.primary,
                      textTransform: 'none',
                    },
                  ]}>
                  {toPriceFormat(data?.total || 0)}
                </Text>
              </View>
            )}
            {_originLabelIndex == 4 && (
              <View style={[styles.horizontalPadding, { marginTop: 12 }]}>
                <Text style={[Typography.name_button, { color: 'black' }]}>
                  {'Lý do hủy đơn hàng'}
                </Text>
                <Text
                  style={[
                    Typography.body,
                    {
                      color: 'black',
                      marginTop: 12,
                    },
                  ]}>
                  {data?.order_cancellation?.message ||
                    cancelReasons[data?.order_cancellation?.reason || '1']}
                </Text>
              </View>
            )}
            <CancelOrderModal
              visible={isOpenModal}
              onCancelOrder={onCancelOrder}
              onClose={toogleModal}
            />
          </ScrollView>
        )}
      </SafeAreaWithHeader>
    </ConnectionDetection.View>
  );
};

const RatingButton = ({ data, product }: { data: OrderItem; product: OrderProductItem }) => {
  const navigation = useNavigation();
  const [reviewed, setReviewed] = useState(product.is_reviewed);

  useEffect(() => {
    const sub = productFeedbackStream.subscribe(({ orderPk, optionPk }) => {
      if (reviewed || orderPk !== data.pk || optionPk !== product.option_pk) return;
      setReviewed(true);
    });

    return () => {
      sub.unsubscribe();
    };
  }, [reviewed]);

  const onRatingPress = (product: OrderProductItem) => {
    if (reviewed) {
      navigation.push(RoutePath.userFeedbackListScreen);
    } else {
      navigation.push(RoutePath.orderFeedbackScreen, { data, product });
    }
  };

  return (
    <Button
      type={ButtonType.primary}
      state={ButtonState.idle}
      onPress={() => onRatingPress(product)}
      text={reviewed ? 'Xem đánh giá' : 'Đánh giá'}
    />
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
  stepIndicatorContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
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
    marginBottom: 12,
    marginTop: -12,
    borderBottomWidth: Outlines.borderWidth.base,
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
    width: Spacing.screen.width - 32 - 74 - 12 - 72 - 4,
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
  paymentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    height: 72,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  paymentMethod: {
    ...Typography.title,
    textTransform: 'uppercase',
    color: Colors.white,
    marginLeft: 4,
  },
  paymentDescription: {
    ...Typography.body,
    color: Colors.white,
  },
  priceCalContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: Colors.background,
  },
  exchangeView: {
    width: 72,
    height: 24,
    marginRight: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const customStyles = {
  stepIndicatorSize: 12,
  currentStepIndicatorSize: 12,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 2,
  stepStrokeWidth: 2,
  stepStrokeUnFinishedColor: Colors.surface.midGray,
  stepStrokeCurrentColor: Colors.primary,
  stepStrokeFinishedColor: Colors.primary,
  separatorUnFinishedColor: Colors.surface.midGray,
  separatorFinishedColor: Colors.primary,
  stepIndicatorUnFinishedColor: Colors.white,
  stepIndicatorCurrentColor: Colors.primary,
  stepIndicatorFinishedColor: Colors.white,
};

export default React.memo(OrderDetailScreen);
