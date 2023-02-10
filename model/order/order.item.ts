import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model/json/json.serializable";
import { StoreInfo } from "model/store/store";
import { OrderCustomer } from "./order.customer";
import { OrderDelivery } from "./order.delivery";
import { OrderProductItem } from "./order.item.product";
import { OrderPayment } from "./order.payment";
import { ShippingAddress } from "./shipping.address";
import { OrderCancellation } from "./order.cancellation";

interface OrderItemType {
  pk: Number;
  code: String;
  cover_picture: String;
  customer: OrderCustomer;
  store: StoreInfo;
  order_items: OrderProductItem[];
  shipping_address: ShippingAddress;
  message_from_customer: String,
  sub_total: Number,
  total_discounted: Number,
  shipping_fee: Number,
  total: Number,
  order_delivery: OrderDelivery,
  order_payment: OrderPayment,
  order_status: String,
  created: String,
  confirmed_at: String,
  purchased_at: String,
  delivering_at: String,
  delivered_at: String,
  completed_at: String,
  cancelled_at: String,
  change_requested_at: String,
  change_completed_at: String,
  order_cancellation: OrderCancellation,
  order_status_id: Number
}

export type { OrderItemType };

@JsonObject("OrderItem")
export class OrderItem extends JsonSerializable<OrderItem> implements OrderItemType {
  protected get classRef(): new () => OrderItem {
    return OrderItem;
  }
  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('sub_total', Number, true)
  sub_total = 0;

  @JsonProperty('total_discounted', Number, true)
  total_discounted = 0;

  @JsonProperty('shipping_fee', Number, true)
  shipping_fee = 0;

  @JsonProperty('total', Number, true)
  total = 0;

  @JsonProperty('code', String, true)
  code = '';

  @JsonProperty('message_from_customer', String, true)
  message_from_customer = '';

  @JsonProperty('cover_picture', String, true)
  cover_picture = '';

  @JsonProperty('order_status', String, true)
  order_status = '';

  @JsonProperty('created', String, true)
  created = '';

  @JsonProperty('confirmed_at', String, true)
  confirmed_at = '';

  @JsonProperty('purchased_at', String, true)
  purchased_at = '';

  @JsonProperty('delivered_at', String, true)
  delivered_at = '';

  @JsonProperty('completed_at', String, true)
  completed_at = '';

  @JsonProperty('delivering_at', String, true)
  delivering_at = '';

  @JsonProperty('cancelled_at', String, true)
  cancelled_at = '';

  @JsonProperty('change_requested_at', String, true)
  change_requested_at = '';

  @JsonProperty('change_completed_at', String, true)
  change_completed_at = '';

  @JsonProperty('order_status_id', Number, true)
  order_status_id = 0;

  @JsonProperty('customer', OrderCustomer, true)
  customer = new OrderCustomer();

  @JsonProperty('order_cancellation', OrderCancellation, true)
  order_cancellation = new OrderCancellation();

  @JsonProperty('store', StoreInfo, true)
  store = new StoreInfo();

  @JsonProperty('shipping_address', ShippingAddress, true)
  shipping_address = new ShippingAddress();

  @JsonProperty('order_delivery', OrderDelivery, true)
  order_delivery = new OrderDelivery();

  @JsonProperty('order_payment', OrderPayment, true)
  order_payment = new OrderPayment();

  @JsonProperty('order_items', [OrderProductItem], true)
  order_items: OrderProductItem[] = [];
}