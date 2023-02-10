import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IOptionContext, OptionContext } from 'scenes/checkout/Cart/context';
import { getSelectedStock } from 'scenes/checkout/Cart/hook';
import { Image, Text, View } from 'react-native';
import { Colors, Typography } from 'styles';
import { toPriceFormat } from '_helper';
import { isNil } from 'lodash';
import Button, { ButtonState, ButtonType } from 'components/button/Button';
import { toast } from 'components/alert/toast';
import { fontExtraBold } from 'styles/typography';
import Ripple from 'react-native-material-ripple';
import { checkCart, partialAddToCart } from 'services/api/cart';
import { useActions } from 'utils/hooks/useActions';
import { HandledError } from 'error';

export const CartSummary = () => {
  return (
    <View>
      <OptionInfoView />
      <TotalView />
    </View>
  );
};

export const TotalView = () => {
  const { stockData, quantity, modalRef, reset } = useContext(OptionContext);
  const { key } = getSelectedStock();

  const { setLoading, showDialog } = useActions();

  const option = useMemo(() => {
    if (!key) return undefined;
    return stockData[key];
  }, [key]);

  const onAddToCart = async () => {
    try {
      setLoading(true);

      await partialAddToCart(option!.id, quantity!);

      setLoading(false);
      modalRef?.close();
      toast('Thêm sản phẩm vào giỏ hàng thành công');
      reset();
      checkCart();
    } catch (e) {
      setLoading(false);
      const error = new HandledError({
        error: e as Error,
        stack: 'CartSummary.onAddToCart',
      });

      showDialog({
        title: error.friendlyMessage,
        actions: [
          {
            text: 'OK',
            onPress: () => { },
            type: ButtonType.primary,
          },
        ],
      });
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.background,
        justifyContent: 'space-between',
      }}>
      <View>
        <Text style={Typography.description}>Tổng cộng</Text>
        <Text style={[Typography.title, { color: Colors.primary }]}>
          {toPriceFormat(isNil(option) ? 0 : option.finalPrice * quantity!)}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <View style={{ width: 158 }}>
        <Button
          state={isNil(option) ? ButtonState.disabled : ButtonState.idle}
          onPress={onAddToCart}
          text={'THÊM VÀO GIỎ'}
        />
      </View>
    </View>
  );
};

export const OptionInfoView = () => {
  const { stockData, setQuantity: contextSetQuantity } = useContext<IOptionContext>(OptionContext);
  const [quantity, setQuantity] = useState(1);
  const { key: id } = getSelectedStock();
  const prevId = useRef(id);

  useEffect(() => {
    contextSetQuantity(quantity);
  }, [quantity]);

  useEffect(() => {
    if (prevId.current !== id) {
      setQuantity(1);
    }
    prevId.current = id;
  }, [id]);

  const add = () => {
    const preOption = stockData[id!];

    if (quantity >= preOption.stock) {
      toast('Bạn đã chọn vượt quá số lượng sản phẩm');
      return;
    } else {
      setQuantity(quantity + 1);
    }
  };

  const subtract = () => {
    if (quantity <= 1) {
      toast('Số lượng sản phẩm không thể giảm về 0');

      return;
    }
    setQuantity(quantity - 1);
  };

  const calcOption = isNil(id)
    ? {
      discount_rate: 0,
      finalPrice: 0,
      stock: 0,
    }
    : stockData[id];

  return (
    <View style={{ paddingHorizontal: 16 }}>
      <View style={{ height: 16 }} />
      <Text style={Typography.title}>Số lượng</Text>
      <View style={{ flexDirection: 'row' }}>
        <View
          testID={`option-item-${id}`}
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingTop: 12,
            paddingBottom: 24,
          }}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {calcOption.discount_rate > 0 && (
                <>
                  <Text
                    testID={`option-item-${id}-discount`}
                    style={[
                      Typography.option,
                      { color: Colors.primary, fontFamily: fontExtraBold },
                    ]}>
                    -{calcOption.discount_rate}%
                  </Text>
                  <View style={{ width: 4 }} />
                </>
              )}
              <Text
                testID={`option-item-${id}-price`}
                style={{ ...Typography.name_button, textTransform: 'none' }}>
                {toPriceFormat(calcOption.finalPrice)}
              </Text>
            </View>
            <Text>Kho: {calcOption.stock}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Ripple
              testID={`option-item-${id}-desc`}
              onPress={subtract}
              style={{ width: 24, height: 24 }}
              rippleContainerBorderRadius={12}>
              <Image source={require('/assets/images/icon/minus.png')} />
            </Ripple>
            <Text style={[Typography.name_button, { width: 26, textAlign: 'center' }]}>
              {quantity}
            </Text>
            <Ripple
              testID={`option-item-${id}-incr`}
              onPress={add}
              style={{ width: 24, height: 24 }}
              rippleContainerBorderRadius={12}>
              <Image source={require('/assets/images/icon/plus.png')} />
            </Ripple>
            {isNil(id) && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'white',
                  opacity: 0.5,
                }}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
