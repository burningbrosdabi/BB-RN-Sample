import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

interface IOrderDelivery {
  pk: Number,
  name: String,
}

export type { IOrderDelivery };

@JsonObject('OrderCustomer')
export class OrderCustomer extends JsonSerializable<OrderCustomer> implements IOrderDelivery {
  protected get classRef(): new () => OrderCustomer {
    return OrderCustomer;
  }
  @JsonProperty('pk', Number, false)
  pk = 0

  @JsonProperty('name', String, true)
  name = ''
}
