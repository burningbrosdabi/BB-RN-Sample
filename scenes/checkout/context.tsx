import { CheckoutSubcart, PaymentMethod } from 'model/checkout/checkout';
import { ICartSummary, ShippingOptionMap, SubcartOption } from 'model/checkout/type';
import { ICoupon } from 'model/coupon/coupon';
import { IRecipient } from 'model/recipient/recipient';
import { createContext } from 'react';
import { store } from 'utils/state/store';
import { first } from 'lodash';

export type SubcartOptionMap = { [id: number]: SubcartOption };

export type ICheckoutContext = {
  optionMap: SubcartOptionMap;
  summary: ICartSummary;
  _digest_key: string | null;
  paymentMethods: PaymentMethod[];
  checkoutSubcart: CheckoutSubcart[];
  selectedPayment: number | null;
  coupon: ICoupon | null;
  recipient: IRecipient | null;
  setShipping: (storePk: number, shippingPk: number) => void;
  setMessage: (storePk: number, message: string) => void;
  setSubCart: (value: SubcartOptionMap) => void;
  setSummary: (value: ICartSummary) => void;
  setDigestKey: (value: string) => void;
  setPaymentMethods: (value: PaymentMethod[]) => void;
  setCheckoutSubcart: (value: CheckoutSubcart[]) => void;
  setSelectedPayment: (value: number | null) => void;
  setCoupon: (value: ICoupon | null) => void;
  setRecipient: (value: IRecipient | null) => void;
};

export const defaultCartSummary = {
  total_item: 0,
  sub_total: 0,
  total_discount: 0,
  total_shipping_fee: 0,
  total: 0,
};

export const CheckoutContext = createContext<ICheckoutContext>({
  optionMap: {},
  summary: defaultCartSummary,
  _digest_key: null,
  paymentMethods: [],
  checkoutSubcart: [],
  selectedPayment: null,
  coupon: null,
  recipient: first(store.getState().user.recipients) ?? null,
  setShipping: (storePk: number, shippingPk: number) => {},
  setMessage: (storePk: number, message: string) => {},
  setSubCart: (value: SubcartOptionMap) => {},
  setSummary: (value: ICartSummary) => {},
  setDigestKey: (value: string) => {},
  setPaymentMethods: (value: PaymentMethod[]) => {},
  setCheckoutSubcart: (value: CheckoutSubcart[]) => {},
  setSelectedPayment: (value: number | null) => {},
  setCoupon: (value: ICoupon | null) => {},
  setRecipient: (value: IRecipient | null) => {},
});

export type IShippingOptionsContext = {
  optionMap: ShippingOptionMap;
  setOptionMap: (value: ShippingOptionMap) => void;
  showModal: (storePk: number) => void;
};

export const ShippingOptionContext = createContext<IShippingOptionsContext>({
  optionMap: {},
  setOptionMap: (value: ShippingOptionMap) => {},
  showModal: (value) => {},
});
