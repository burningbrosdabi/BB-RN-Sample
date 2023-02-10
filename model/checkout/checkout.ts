import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from 'json2typescript';
import { isNil } from 'lodash';
import type {
  CheckoutSubcartMap, ICartSummary,
  ICheckoutCart,
  ICheckoutDigest, ICheckoutSubcart,
  IPaymentMethod, IShippingOptions, ISubCartSummary
} from 'model/checkout/type';
import { DateConverter, JsonSerializable, JSONType } from 'model/json/json.serializable';
import { CartProductOption } from 'model/product/product.options';
import { StoreMinifiedInfo } from 'model/store/store';
import { extractOption } from 'services/api/cart/cart.api';
import { guard } from 'utils/helper/function.helper';

@JsonObject('SubCartSummary')
export class SubCartSummary extends JsonSerializable<SubCartSummary> implements ISubCartSummary {
  protected get classRef(): new () => SubCartSummary {
    return SubCartSummary;
  }

  @JsonProperty('total_item', Number, true)
  total_item = 0;

  @JsonProperty('sub_cart_subtotal', Number, true)
  sub_cart_subtotal = 0;

  @JsonProperty('sub_cart_total', Number, true)
  sub_cart_total = 0;
}

@JsonConverter
export class CartProductOptionConverter implements JsonCustomConvert<CartProductOption[]> {
  serialize(value: CartProductOption[]): JSONType[] {
    return new CartProductOption().toListJSON(value);
  }

  deserialize(value: JSONType[]): CartProductOption[] {
    const data = value.map((val) => extractOption(val));

    return data.filter((value) => {
      return !isNil(value);
    }) as CartProductOption[];
  }
}

@JsonObject('CheckoutSubcart')
export class CheckoutSubcart extends JsonSerializable<CheckoutSubcart> implements ICheckoutSubcart {
  protected get classRef(): new () => CheckoutSubcart {
    return CheckoutSubcart;
  }

  @JsonProperty('pk', Number, false)
  pk!: number;

  @JsonProperty('store', StoreMinifiedInfo, true)
  store = new StoreMinifiedInfo();

  @JsonProperty('summary', SubCartSummary, true)
  summary = new SubCartSummary();

  @JsonProperty('items', CartProductOptionConverter, false)
  items!: CartProductOption[];

  @JsonProperty('available_coupons', [String], true)
  available_coupons = [];
}

@JsonObject('PaymentMethod')
export class PaymentMethod extends JsonSerializable<PaymentMethod> implements IPaymentMethod {
  protected get classRef(): new () => PaymentMethod {
    return PaymentMethod;
  }

  @JsonProperty('pk', Number, false)
  pk!: number;

  @JsonProperty('name', String, false)
  name = '';

  @JsonProperty('display_name', String, false)
  display_name = '';
}

@JsonObject('CartSummary')
export class CartSummary extends JsonSerializable<CartSummary> implements ICartSummary {
  protected get classRef(): new () => CartSummary {
    return CartSummary;
  }

  // @JsonProperty('total_item', Number, true)
  // total_item = 0;

  @JsonProperty('sub_total', Number, true)
  sub_total = 0;

  @JsonProperty('total_discount', Number, true)
  total_discount = 0;

  @JsonProperty('total', Number, true)
  total = 0;

  @JsonProperty('total_shipping_fee', Number, true)
  total_shipping_fee = 0;
}

@JsonConverter
export class CheckoutSubcartConverter implements JsonCustomConvert<CheckoutSubcartMap> {
  serialize(value: CheckoutSubcartMap): JSONType[] {
    return Object.values(value);
  }
  deserialize(value: JSONType[]): CheckoutSubcartMap {
    const results: CheckoutSubcartMap = {};
    value.forEach((json) => {
      const subcart = guard(() => new CheckoutSubcart().fromJSON(json));
      if (isNil(subcart)) return;
      results[subcart.pk] = subcart;
    });

    return results;
  }
}

@JsonObject('CheckoutCart')
export class CheckoutCart extends JsonSerializable<CheckoutCart> implements ICheckoutCart {
  protected get classRef(): new () => CheckoutCart {
    return CheckoutCart;
  }

  @JsonProperty('summary', CartSummary, false)
  summary!: CartSummary;

  @JsonProperty('sub_carts', [CheckoutSubcart], false)
  sub_carts: CheckoutSubcart[] = [];
}

@JsonObject('CheckoutDigest')
export class CheckoutDigest extends JsonSerializable<CheckoutDigest> implements ICheckoutDigest {
  protected get classRef(): new () => CheckoutDigest {
    return CheckoutDigest;
  }

  @JsonProperty('payment_methods', [PaymentMethod], false)
  payment_methods!: PaymentMethod[];

  @JsonProperty('cart', CheckoutCart, false)
  cart!: CheckoutCart;

  @JsonProperty('_digest_key', String, false)
  _digest_key!: string;
}

@JsonObject('ShippingOptions')
export class ShippingOptions extends JsonSerializable<ShippingOptions> implements IShippingOptions {
  protected get classRef(): new () => ShippingOptions {
    return ShippingOptions;
  }

  @JsonProperty('pk', Number, false)
  pk!: number;

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('total', Number, false)
  total!: number;

  @JsonProperty('lead_time', DateConverter, false)
  lead_time = new Date();
}
