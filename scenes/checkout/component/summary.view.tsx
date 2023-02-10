import { FirebaseAnalyticsTypes } from '@react-native-firebase/analytics';
import { StackActions, useNavigation } from '@react-navigation/native';
import { toast } from 'components/alert/toast';
import Button, { ButtonProps, ButtonState } from 'components/button/Button';
import { HandledError } from 'error';
import { cloneDeep, isEqual, isNil, omit } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Linking, StyleSheet, Text, View } from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import {
  CheckoutArchiveRouteSetting,
  CheckoutOverviewRouteSetting,
  CheckoutPaymentRouteSetting
} from 'routes/checkout/checkout.route';
import { RoutePath } from 'routes/RouteSetting';
import { checkCart } from 'services/api/cart';
import { getShippingOptionMap, purchase, recalculate } from 'services/api/checkout/checkout.api';
import { Logger } from 'services/log';
import { useNavigator } from 'services/navigation/navigation.service';
import { Colors, Typography } from 'styles';
import { toPriceFormat } from 'utils/helper';
import { unAwaited } from 'utils/helper/function.helper';
import { useActions } from 'utils/hooks/useActions';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { useKeyboardListener } from 'utils/hooks/useKeyboardListener';
import { useTypedSelector } from 'utils/hooks/useTypedSelector';
import { CheckoutContext, ShippingOptionContext, SubcartOptionMap } from '../context';
import { resetAppliedCoupon, useShippingOptionGetter } from '../helper.hook';

export const SUMMARY_VIEW_HEIGHT = 172;

export const SummaryView = () => {
  const displayAnim = useRef(new Animated.Value(0)).current;
  const prevOptionMap = useRef<SubcartOptionMap>();
  const {
    summary,
    optionMap,
    _digest_key,
    setSummary,
    setSubCart,
    setCoupon,
    recipient,
  } = useContext(CheckoutContext);

  const { setOptionMap } = useContext(ShippingOptionContext);

  const prevAddressPk = useRef<number>();

  const navigator = useNavigator();

  useEffect(() => {
    if (isNil(_digest_key)) return;

    Animated.timing(displayAnim, {
      toValue: 1,
      duration: 160,
      useNativeDriver: true,
    }).start();

    const unsubscribe = navigator.addOnRouteListener((route) => {
      if (route === RoutePath.checkoutOverview) {
        startAnim(2);
      } else startAnim(1);
    });

    return () => {
      unsubscribe();
    };
  }, [_digest_key]);

  const _recalculate = useCallback(async () => {
    const shipping_address = recipient?.id ?? null;

    if (recipient?.id !== prevAddressPk.current) {
      const storePks = Object.keys(optionMap).map((key) => Number.parseInt(key, 10));

      await getShippingOptionMap(storePks, recipient?.id)
        .then((shippingOption) => {
          prevAddressPk.current = recipient?.id;
          setOptionMap(shippingOption);
        })
        .catch((_) => { });
    }

    return recalculate(_digest_key!, Object.values(optionMap), shipping_address);
  }, [optionMap, _digest_key, recipient]);

  const { state, excecute, data, error } = useAsync(
    _recalculate,
    {
      initialState: ConnectionState.hasData
    }
  );

  useEffect(() => {
    if (!error) return;

    const _error = new HandledError({
      error: error as Error,
      stack: 'SummaryView.useEffect[error]',
    });
    toast(_error.friendlyMessage);
  }, [error]);

  useEffect(() => {
    if (isNil(_digest_key)) return;
    // if (!prevOptionMap?.current) {
    //   if (prevOptionMap) prevOptionMap.current = cloneDeep(optionMap);

    //   return;
    // }

    if (
      !hasNewOptionMap(prevOptionMap?.current, optionMap) &&
      recipient?.id === prevAddressPk?.current
    ) {
      return;
    }

    unAwaited(excecute());
  }, [optionMap, _digest_key, recipient]);

  useEffect(() => {
    if (state === ConnectionState.hasData || state === ConnectionState.hasEmptyData) {
      prevOptionMap.current = cloneDeep(optionMap);
      if (!isNil(data)) {
        setSummary(data);
      }
    }
    if (state === ConnectionState.hasError && !isNil(prevOptionMap.current)) {
      const _onptionMap = resetAppliedCoupon(optionMap);

      // prevent loop Maximum update depth exceeded.
      // This can happen when a component calls setState inside useEffect
      if (!hasNewOptionMap(_onptionMap, optionMap)) {
        return;
      }

      setSubCart(_onptionMap);
      setCoupon(null);
    }
  }, [state, optionMap, data]);

  const hasNewOptionMap = (prev: SubcartOptionMap | undefined, curr: SubcartOptionMap): boolean => {
    if (!prev) return true;
    for (const key of Object.keys(curr).map((key) => Number.parseInt(key, 10))) {
      const prevOption = omit(prev[key], 'message_from_customer');
      const curOption = omit(curr[key], 'message_from_customer');

      if (!isEqual(prevOption, curOption)) return true;
    }

    return false;
  };

  const startAnim = useCallback(
    (value: 0 | 1 | 2) => {
      Animated.timing(displayAnim, {
        toValue: value,
        duration: 120,
        useNativeDriver: true,
      }).start();
    },
    [displayAnim],
  );

  const onShow = () => startAnim(0);
  const onHide = () => startAnim(1);

  useKeyboardListener({ onHide, onShow });

  const btnProps = useButtonBuiler({ state });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: displayAnim.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [SUMMARY_VIEW_HEIGHT, 44, 0],
              }),
            },
          ],
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: 32,
        }}>
        {state !== ConnectionState.waiting && (
          <>
            <Text style={Typography.description}>Tổng thanh toán</Text>
            <View style={{ width: 4 }} />
            <Text style={[Typography.h1, { color: Colors.primary, textTransform: 'none' }]}>
              {toPriceFormat(summary?.total)}
            </Text>
          </>
        )}
      </View>

      <View style={{ flex: 1 }} />
      <View style={{ height: 48, width: '100%' }}>
        <Button {...btnProps} />
      </View>
      <View style={{ height: 8 }} />
      <Animated.View
        style={{
          width: '100%',
          opacity: displayAnim.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 0, 1],
          }),
        }}>
        <TnCLine />
      </Animated.View>
    </Animated.View>
  );
};

const TnCLine = () => {
  const getLinkText = (url: string) =>
    url === 'https://dabivn.com/privacy-policy/' ? 'Điều khoản thương mại' : url;
  const onPress = (url: string) => Linking.openURL(url);

  return (
    <Hyperlink
      onPress={onPress}
      linkStyle={[Typography.description, { textDecorationLine: 'underline' }]}
      linkText={getLinkText}>
      <Text style={Typography.description}>
        Bấm “Đặt hàng" đồng nghĩa với việc bạn đồng ý với https://dabivn.com/privacy-policy/ tại
        Dabi
      </Text>
    </Hyperlink>
  );
};

const useButtonBuiler = ({ state }: { state: ConnectionState }): ButtonProps => {
  const navigator = useNavigator();
  const { selectedPayment } = useContext(CheckoutContext);
  const [route, setRoute] = useState('');
  const mounted = useRef(true);

  useEffect(() => {
    const unsubscribe = navigator.addOnRouteListener((route) => {
      if (!mounted.current) return;
      setRoute(route);
    });

    return () => {
      mounted.current = false;
      unsubscribe();
    };
  }, []);

  const processPurchase = useCheckoutPurchase();

  const buttonProps = useMemo(() => {
    const currentRoute = navigator.currentTab;
    let onPress = () => { };
    let text = '';
    let screenValid = true;
    switch (currentRoute) {
      case RoutePath.checkoutDigest:
        onPress = () => navigator.navigate(new CheckoutPaymentRouteSetting());
        text = 'TIẾP TỤC';
        break;
      case RoutePath.checkoutPayment:
        onPress = () => navigator.navigate(new CheckoutOverviewRouteSetting());
        text = 'TIẾP TỤC';
        screenValid = !isNil(selectedPayment);
        break;
      case RoutePath.checkoutOverview:
        onPress = processPurchase;
        text = 'ĐẶT HÀNG';
      default:
        break;
    }

    return {
      state:
        state === ConnectionState.waiting
          ? ButtonState.loading
          : screenValid
            ? ButtonState.idle
            : ButtonState.disabled,

      onPress,
      text
    };
  }, [route, state, selectedPayment]);

  return {
    ...buttonProps,
  };
};

const useCheckoutPurchase = () => {
  const { _digest_key, selectedPayment, optionMap, recipient, checkoutSubcart, summary, coupon } = useContext(CheckoutContext);
  const { userInfo } = useTypedSelector((state) => state.user);
  const { setLoading, showDialog, setUserInfo } = useActions();
  const navigator = useNavigator();

  const getShipping = useShippingOptionGetter();

  const onPurchase = useCallback(() => {
    if (!_digest_key || !selectedPayment) return Promise.resolve();

    const sub_carts = Object.values(optionMap);
    setLoading(true);

    const shipping_address = recipient?.id ?? null;

    return purchase({
      _digest_key,
      payment_method: selectedPayment,
      shipping_address,
      sub_carts,
    }).finally(() => setLoading(false));
  }, [_digest_key, selectedPayment, optionMap]);

  const { error, excecute, state } = useAsync(onPurchase);

  useEffect(() => {
    if (isNil(error)) return;
    const exception = new HandledError({
      error: error as Error,
      stack: 'useCheckoutPurchase.useEffect',
    });

    exception.log(true);

    showDialog({
      title: 'Không thể đặt hàng',
      description: exception.friendlyMessage,
      actions: [
        {
          text: 'OK',
          onPress: () => { },
        },
      ],
    });
  }, [error]);
  const navigation = useNavigation();

  useEffect(() => {
    if (state === ConnectionState.hasData || state === ConnectionState.hasEmptyData) {
      if (userInfo?.order_count_summary) {
        setUserInfo({
          ...userInfo,
          order_count_summary: {
            ...userInfo.order_count_summary,
            waiting_count: userInfo.order_count_summary.waiting_count + 1
          }
        })
      }

      // log purchase
      const items: FirebaseAnalyticsTypes.Item[] = [];
      let shippingTotal = 0;
      checkoutSubcart.forEach(subcart => {
        const shipping = getShipping(subcart.store.pk);
        shippingTotal += shipping?.total || 0;
        subcart.items.forEach(subcartItem => {
          items.push({
            item_category: "Dabi",
            item_brand: subcart?.store.insta_id || '',
            item_id: (subcartItem?.product_pk + '') || '',
            item_name: subcartItem?.name || '',
            item_variant: `${subcartItem.color}.${subcartItem.size}.${subcartItem.extra_option}`,
            quantity: subcartItem.quantity || 0,
            item_location_id: '',
          })
        });
      });

      const logParams = {
        value: summary.total || 0,
        items: items,
        coupon: coupon?.code,
        affiliation: "Dabi",
        transaction_id: '',
        shipping: shippingTotal,
      }
      Logger.instance.logPurchase(logParams);
      // end log purchase
      navigation.dispatch(StackActions.popToTop);
      unAwaited(checkCart());
      navigator.navigate(new CheckoutArchiveRouteSetting());
    }
  }, [state]);

  return excecute;
};

const styles = StyleSheet.create({
  container: {
    // height: 120,
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: Colors.background,
    alignItems: 'flex-end',
  },
});
