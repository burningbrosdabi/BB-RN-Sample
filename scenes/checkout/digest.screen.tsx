import { useRoute } from '@react-navigation/native';
import { GenericErrorView } from 'components/empty/EmptyView';
import HandledError from 'error/error';
import { get, isEmpty, isNil } from 'lodash';
import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { getCheckoutData } from 'services/api/checkout/checkout.api';
import { ConnectionState, useAsync } from 'utils/hooks/useAsync';
import { OrderList, PlaceholderList } from './component/checkout.list';
import { CheckoutContext, ShippingOptionContext, SubcartOptionMap } from './context';

export const DigestScreen = () => {
  const route = useRoute();
  const item_ids = get(route.params, 'ids', []) as number[];

  const {
    setShipping,
    setSubCart,
    optionMap: subcart,
    setSummary,
    setDigestKey,
    setPaymentMethods,
    setCheckoutSubcart,
  } = useContext(CheckoutContext);
  const { setOptionMap: setShippingOptionMap } = useContext(ShippingOptionContext);
  const { data, state, excecute, error } = useAsync(() => getCheckoutData(item_ids));

  useEffect(() => {
    excecute();
  }, []);

  useEffect(() => {
    if (isNil(error)) return;
    new HandledError({
      error: error as Error,
      stack: 'DigestScreen.useEffect',
    }).log(true);
  }, [error]);

  useEffect(() => {
    if (state !== ConnectionState.hasData && isNil(data)) return;
    const { digest, shippingOption } = data!;

    if (isEmpty(subcart)) {
      const subcartOptionMap: SubcartOptionMap = {};

      digest.cart.sub_carts.forEach((sub) => {
        const storePk = sub.store.pk;
        subcartOptionMap[storePk] = {
          pk: sub.pk,
          shipping_option_id: get(shippingOption, `[${storePk}][0].pk`) as number | undefined,
          applied_coupon: null,
          message_from_customer: null
        };
      });

      setSubCart(subcartOptionMap);
    }

    setSummary(digest.cart.summary);
    setCheckoutSubcart(digest.cart.sub_carts);
    setShippingOptionMap(shippingOption);
    setDigestKey(digest._digest_key);
    setPaymentMethods(digest.payment_methods);
  }, [data, state]);

  return (
    <View style={{ flex: 1 }}>
      {state === ConnectionState.hasData && <OrderList />}
      {state === ConnectionState.waiting && <PlaceholderList />}
      {(state === ConnectionState.hasEmptyData || state === ConnectionState.hasError) && (
        <GenericErrorView action={{ text: 'Thử Lại', onPress: excecute }} />
      )}
    </View>
  );
};
