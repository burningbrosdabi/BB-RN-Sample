import { get, mapValues } from 'lodash';
import { ICheckoutSubcart, IShippingOptions, SubcartOption } from 'model/checkout/type';
import { ICoupon } from 'model/coupon/coupon';
import { useCallback, useContext, useMemo } from 'react';
import { CheckoutContext, ShippingOptionContext, SubcartOptionMap } from './context';

export const useShippingOptionGetter = (): ((storePk: number) => IShippingOptions | undefined) => {
  const { optionMap: shippingOption } = useContext(ShippingOptionContext);
  const { optionMap } = useContext(CheckoutContext);

  const fn = useCallback(
    (storePk: number) => {
      const shippingId = get(optionMap, `[${storePk}].shipping_option_id`) as number | undefined;

      const shippings = get(shippingOption, `[${storePk}]`, []) as IShippingOptions[];
      const shipping = shippings.find((shipping) => shipping.pk === shippingId);

      return shipping;
    },
    [optionMap, shippingOption],
  );

  return fn;
};

export const useCouponSetter = () => {
  const { checkoutSubcart, optionMap, _digest_key, setSubCart, setCoupon } = useContext(
    CheckoutContext,
  );

  const getApliableStoreVoucher = (
    subcarts: ICheckoutSubcart[],
    coupon: ICoupon,
  ): { [id: number]: number } => {
    const storeVoucherMap: { [id: number]: number } = {};
    let limit = coupon.availability;
    const minimum_amount = coupon.minimum_amount;

    for (const subcart of subcarts) {
      if (limit <= 0) break;
      const storePk = subcart.store.pk;
      const sub_cart_subtotal = subcart.summary.sub_cart_subtotal;
      if (limit > 0 && sub_cart_subtotal >= minimum_amount) {
        storeVoucherMap[storePk] = coupon.pk;
        --limit;
      }
    }

    return storeVoucherMap;
  };

  const _setCoupon = useCallback(
    async (coupon: ICoupon) => {
      const storeVoucherMap = getApliableStoreVoucher(checkoutSubcart, coupon);
      const _cloneOptionMap = resetAppliedCoupon(optionMap);

      Object.keys(storeVoucherMap).forEach((storePk) => {
        const pk = Number.parseInt(storePk, 10);
        if (!_cloneOptionMap[pk]) return;
        _cloneOptionMap[pk].applied_coupon = storeVoucherMap[pk];
      });

      setCoupon(coupon);
      setSubCart(_cloneOptionMap);
    },
    [checkoutSubcart, optionMap, _digest_key],
  );

  return _setCoupon;
};

export const resetAppliedCoupon = (subcartOptionMap: SubcartOptionMap) => {
  const newOptionMap = mapValues<SubcartOptionMap, SubcartOption>(subcartOptionMap, (subcart) => {
    return {
      ...subcart,
      applied_coupon: null,
    };
  });

  return newOptionMap;
};

export const useGetSubcartTotal = (storePk: number) => {
  const { checkoutSubcart, optionMap, coupon } = useContext(CheckoutContext);
  const { optionMap: shippingOption } = useContext(ShippingOptionContext);

  const subtotal = useMemo(() => {
    const subcart = checkoutSubcart.find((sub) => sub.store.pk === storePk);

    return subcart?.summary?.sub_cart_subtotal ?? 0;
  }, [checkoutSubcart, storePk]);

  const getShipping = useShippingOptionGetter();

  const shipping = useMemo(() => {
    const shipping = getShipping(storePk);

    return shipping?.total ?? 0;
  }, [storePk, shippingOption]);

  const discount = useMemo(() => {
    const { applied_coupon } = optionMap[storePk] ?? {};
    if (!applied_coupon) return 0;

    const coupon_off = coupon?.amount_off ?? 0;
    if (coupon_off > shipping) return shipping;

    return coupon_off;
  }, [optionMap, storePk, shipping]);

  const total = useMemo(() => {
    return subtotal + shipping - discount;
  }, [shipping, discount, subtotal]);

  return {
    shipping,
    discount,
    subtotal,
    total,
  };
};
