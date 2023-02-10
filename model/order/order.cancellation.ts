import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

interface IOrderCancellation {
  id: Number,
  created: String,
  modified: String,
  order: Number,
  reason: Number,
  message: String,
  pk: Number,
}

export type { IOrderCancellation };

@JsonObject('OrderCancellation')
export class OrderCancellation extends JsonSerializable<OrderCancellation> implements IOrderCancellation {
  protected get classRef(): new () => OrderCancellation {
    return OrderCancellation;
  }
  @JsonProperty('pk', Number, false)
  pk = 0

  @JsonProperty('id', Number, true)
  id = 0

  @JsonProperty('order', Number, true)
  order = 0

  @JsonProperty('reason', Number, true)
  reason = 0

  @JsonProperty('message', String, true)
  message = ''

  @JsonProperty('created', String, true)
  created = ''

  @JsonProperty('modified', String, true)
  modified = '';
}
