import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

interface IOrderDelivery {
  id: Number,
  created_at: String,
  updated_at: String,
  delivery_vendor: Number,
  order: Number,
  prefer_delivery_time: Number,
  lead_time: String,
  shipping_id: String,
  fulfilled_at: String,
  shipped_at: String,
  pk: Number,
  delivery_vendor_name: String,
}

export type { IOrderDelivery };

@JsonObject('OrderDelivery')
export class OrderDelivery extends JsonSerializable<OrderDelivery> implements IOrderDelivery {
  protected get classRef(): new () => OrderDelivery {
    return OrderDelivery;
  }
  @JsonProperty('pk', Number, false)
  pk = 0

  @JsonProperty('id', Number, true)
  id = 0

  @JsonProperty('delivery_vendor', Number, true)
  delivery_vendor = 0

  @JsonProperty('order', Number, true)
  order = 0

  @JsonProperty('prefer_delivery_time', Number, true)
  prefer_delivery_time = 0

  @JsonProperty('shipping_id', String, true)
  shipping_id = ''

  @JsonProperty('created_at', String, true)
  created_at = ''

  @JsonProperty('updated_at', String, true)
  updated_at = '';

  @JsonProperty('lead_time', String, true)
  lead_time = '';

  @JsonProperty('fulfilled_at', String, true)
  fulfilled_at = '';

  @JsonProperty('shipped_at', String, true)
  shipped_at = '';

  @JsonProperty('delivery_vendor_name', String, true)
  delivery_vendor_name = '';
}
