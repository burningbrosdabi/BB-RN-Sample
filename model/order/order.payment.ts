import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

interface IOrderPayment {
  id: Number,
  created_at: String,
  updated_at: String,
  order: Number,
  amount: Number,
  transaction_id: Number,
  payment_method: Number,
  pk: Number,
  payment_method_name: String
}

export type { IOrderPayment };

@JsonObject('OrderPayment')
export class OrderPayment extends JsonSerializable<OrderPayment> implements IOrderPayment {
  protected get classRef(): new () => OrderPayment {
    return OrderPayment;
  }
  @JsonProperty('pk', Number, false)
  pk = 0

  @JsonProperty('id', Number, true)
  id = 0

  @JsonProperty('order', Number, true)
  order = 0

  @JsonProperty('amount', Number, true)
  amount = 0

  @JsonProperty('transaction_id', Number, true)
  transaction_id = 0

  @JsonProperty('payment_method', Number, true)
  payment_method = 0

  @JsonProperty('created_at', String, true)
  created_at = ''

  @JsonProperty('updated_at', String, true)
  updated_at = '';

  @JsonProperty('payment_method_name', String, true)
  payment_method_name = '';
}
