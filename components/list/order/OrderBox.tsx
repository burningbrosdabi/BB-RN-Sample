import { useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import { OrderItem, OrderProductItem } from 'model';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { RoutePath } from 'routes';
import { OrderDetailRouteSetting } from 'routes/order/order.route';
import CancelOrderModal from 'scenes/order/orderHistory/CancelOrderModal';
import {
  cancelOrderApi,
  completeOrderApi,
  orderStatusStream,
  productFeedbackStream,
} from 'services/api';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Outlines, Spacing, Typography } from 'styles';
import { fontExtraBold } from 'styles/typography';
import { toPriceFormat } from 'utils/helper';
import { useActions } from 'utils/hooks/useActions';
import { orderStatusTranslation } from 'utils/translations';
import { Button, ButtonType, LayoutConstraint } from 'components/button/Button';
import ImageElement from 'components/images/ImageElement';
import ProfileImage from 'components/images/ProfileImage';
import { OrderStatus } from 'scenes/order/orderHistory/type';
import { HandledError } from 'error';
import { isEmpty } from "lodash";
import { ProductOrderInfo } from "components/list/order/ProductOrderInfo";

interface OrderBoxProps {
  data: OrderItem;
  status: OrderStatus;
}

const OrderBox = ({ status, data }: OrderBoxProps) => {
  const navigation = useNavigation();
  const { setLoading, showDialog } = useActions();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const product = data.order_items?.length > 0 ? data.order_items[0] : null;
  const [reviewed, setReviewed] = useState((data.order_items || []).some(res => res.is_reviewed));
  const { option_color = '', option_size = '', option_extra_option = '' } = product || {};
  const productOption = [option_color, option_size, option_extra_option].filter(res => res);
  let actionText = '';
  if (data.order_status_id <= 2) {
    actionText = 'Hủy đơn';
  } else if (data.order_status_id <= 3) {
    actionText = 'Đã nhận hàng';
  } else if (data.order_status_id <= 5) {
    actionText = 'Đổi/Trả hàng';
  }
  const [disabled, setDisabled] = useState(false);

  const feedbackRef = useRef<{ [id: number]: true }>(
    data.order_items.reduce((prev, curr) => {
      if (!curr.is_reviewed) return prev;
      return { ...prev, [curr.option_pk]: curr.is_reviewed };
    }, {}),
  );

  useEffect(() => {
    const sub = orderStatusStream.subscribe(value => {
      if (value.pk === data.pk && value.status !== status) {
        setDisabled(true);
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [disabled]);

  useEffect(() => {
    const sub = productFeedbackStream.subscribe(({ optionPk, orderPk }) => {
      if (orderPk !== data.pk) return;

      if (!data.order_items.some(({ option_pk }) => option_pk === optionPk)) {
        return;
      }

      feedbackRef.current[optionPk] = true;
      if (Object.keys(feedbackRef.current).length !== data.order_items.length) return;

      if (!reviewed) {
        setReviewed(true);
      }
    });

    return () => {
      sub.unsubscribe();
    };
  }, [reviewed]);

  const navigator = useNavigator();

  const onOrderDetailPress = () => {
    navigator.navigate(new OrderDetailRouteSetting({ id: data.code }));
  };

  const onOrderRatingPress = () => {
    if (reviewed) {
      navigation.push(RoutePath.userFeedbackListScreen);
    } else {
      navigator.navigate(new OrderDetailRouteSetting({ id: data.code }));
    }
  };

  const onStorePress = () => {
    // @ts-ignore
    navigation.navigate('StoreDetail', { store: data.store });
  };

  const onProductDetailPress = () => {
    product && navigation.push(RoutePath.productDetail, { productPk: product.product_pk });
  };

  const onOrderOptionlPress = () => {
    switch (data.order_status_id) {
      case 0:
      case 1:
      case 2:
        // cancel order
        toogleModal();
        break;
      case 3:
        // confirm received order
        onCompletedOrder();
        break;
      case 4:
      case 5:
        // Exchange/refund
        navigation.push(RoutePath.ordersRefundExchangScreen, { data: data });
        break;
      default:
        break;
    }
  };

  const toogleModal = () => {
    setIsOpenModal(!isOpenModal);
  };

  const onCompletedOrder = async () => {
    try {
      setLoading(true);
      await completeOrderApi(data?.pk);

      setLoading(false);
      toast('Đơn hàng của bạn đã được cập nhật');
    } catch (error) {
      setLoading(false);
      showDialog({
        title: (error as HandledError).friendlyMessage,
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
      await cancelOrderApi(data?.pk, { reason: item?.id + '', message: message });

      setLoading(false);
      toast('Đơn hàng của bạn đã được cập nhật');
    } catch (error) {
      setLoading(false);
      showDialog({
        title: (error as HandledError).friendlyMessage,
        actions: [
          {
            type: ButtonType.primary,
            text: 'Ok',
            onPress: () => {
              /***/
            },
          },
        ],
      });
    }
  };

  return (
    <View style={[styles.container, { opacity: disabled ? 0.3 : 1 }]}>
      {/* Store Infor */}
      <View style={styles.rowSpaceContainer}>
        <TouchableOpacity
          onPress={onStorePress}
          style={[styles.rowContainer, { width: Spacing.screen.width - 32 - 52 }]}>
          <ProfileImage size={40} source={data.store?.profile_image} />
          <View style={{ width: Spacing.screen.width - 32 - 52 - 40 - 12, marginLeft: 12 }}>
            <View style={[styles.rowContainer]}>
              <Text
                numberOfLines={1}
                style={{
                  ...Typography.name_button,
                  textTransform: 'none',
                  maxWidth: Spacing.screen.width - 32 - 52 - 40 - 12 - 12 - 60,
                  marginRight: 8,
                }}>
                {data.store?.insta_id}
              </Text>
            </View>
            <Text style={{ ...Typography.description, color: Colors.primary }}>
              {orderStatusTranslation[data.order_status_id || 0]?.traslation}
            </Text>
          </View>
        </TouchableOpacity>
        <Ripple onPress={onOrderDetailPress}>
          <Text style={{ ...Typography.description, marginLeft: 12, maxWidth: 52 }}>
            {'Chi tiết'}
          </Text>
        </Ripple>
      </View>

      <ProductOrderInfo hasBottomAction={!isEmpty(actionText)} total={data.total} onPress={onOrderDetailPress} product={product!} />
      {/* Delivery Info */}
      {actionText ? (
        <View style={[styles.rowSpaceContainer, { marginBottom: 0, marginTop: 12 }]}>
          <View style={styles.rowContainer}>
            <Image
              style={styles.iconShipping}
              source={require('_assets/images/icon/info_shipping.png')}
            />
            {data.order_delivery.lead_time && moment(data.order_delivery.lead_time).isValid() ? (
              <Text style={{ ...Typography.description, color: Colors.primary, marginLeft: 12 }}>
                {moment(data.order_delivery.lead_time).format('DD MMM')}
              </Text>
            ) : undefined}
          </View>
          <Button
            constraint={LayoutConstraint.wrapChild}
            text={actionText}
            textStyle={{ textTransform: 'none' }}
            type={ButtonType.outlined}
            style={{ alignSelf: 'center' }}
            onPress={onOrderOptionlPress}
          />
        </View>
      ) : undefined}
      {(data.order_status_id === 4 || data.order_status_id === 5) && (
        <Button
          constraint={LayoutConstraint.wrapChild}
          text={reviewed ? 'Xem đánh giá' : 'Đánh giá'}
          textStyle={{ textTransform: 'none' }}
          type={ButtonType.primary}
          style={{ alignSelf: 'flex-end', marginTop: 12 }}
          onPress={onOrderRatingPress}
        />
      )}
      <CancelOrderModal visible={isOpenModal} onCancelOrder={onCancelOrder} onClose={toogleModal} />
      {disabled && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
          }}
        />
      )}
    </View>
  );
};

export default React.memo(OrderBox);



const styles = StyleSheet.create({
  container: {
    borderBottomWidth: Outlines.borderWidth.medium,
    borderColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  chatIcon: {
    marginRight: 4,
    width: 12,
    height: 11,
    resizeMode: 'contain',
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
});
