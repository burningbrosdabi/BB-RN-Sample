import {
  ICartProductOption
} from 'model/product/product.options';
import type { IStoreMinifiedInfo } from 'model/store/store';

interface ISubCartSummary {
  total_item: number;
  sub_cart_subtotal: number;
  sub_cart_total: number;
}

interface ICheckoutSubcart {
  pk: number;
  store: IStoreMinifiedInfo;
  summary: ISubCartSummary;
  items: ICartProductOption[];
  available_coupons: string[];
}

interface IPaymentMethod {
  pk: number;
  name: string;
  display_name: string;
}

export type CheckoutSubcartMap = { [id: number]: ICheckoutSubcart };

interface ICheckoutCart {
  summary: ICartSummary;
  sub_carts: CheckoutSubcartMap;
}

interface ICheckoutDigest {
  payment_methods: IPaymentMethod[];
  cart: ICheckoutCart;
  _digest_key: string;
}

interface IShippingOptions {
  pk: number;
  name: string;
  total: number;
  lead_time: Date;
}

type ShippingOptionMap = { [id: number]: IShippingOptions[] };

type SubcartOption = {
  pk: number;
  shipping_option_id?: number;
  applied_coupon?: number | null;
  message_from_customer: string | null;
};

interface ICartSummary {
  total_item?: number;
  sub_total?: number;
  total_discount?: number;
  total_shipping_fee?: number;
  total?: number;
}

export type {
  ISubCartSummary,
  IPaymentMethod,
  ICheckoutSubcart,
  ICartSummary,
  ICheckoutCart,
  ICheckoutDigest,
  IShippingOptions,
  ShippingOptionMap,
  SubcartOption,
};
