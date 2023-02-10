import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

interface IFeedbackOptionType {
  pk: Number,
  name: String,
  size: Number,
  color: String,
  stock: Number,
  currency: String,
  extra_option: String,
  is_free_ship: Boolean,
  discount_rate: Number,
  discount_price: Number,
  original_price: Number,
  product_discount_rate: Number,
  product_discount_price: Number,
  product_original_price: Number,
}

export type { IFeedbackOptionType };

@JsonObject('FeedbackOptionType')
export class FeedbackOptionType extends JsonSerializable<FeedbackOptionType> implements IFeedbackOptionType {
  protected get classRef(): new () => FeedbackOptionType {
    return FeedbackOptionType;
  }
  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('size', Number, true)
  size = 0;

  @JsonProperty('gender', String, true)
  gender = '';

  @JsonProperty('color', String, true)
  color = '';

  @JsonProperty('stock', Number, true)
  stock = 0;

  @JsonProperty('currency', String, true)
  currency = '';

  @JsonProperty('extra_option', String, true)
  extra_option = '';

  @JsonProperty('is_free_ship', Boolean, true)
  is_free_ship = false;

  @JsonProperty('discount_rate', Number, true)
  discount_rate = 0;

  @JsonProperty('discount_price', Number, true)
  discount_price = 0;

  @JsonProperty('original_price', Number, true)
  original_price = 0;

  @JsonProperty('product_discount_rate', Number, true)
  product_discount_rate = 0;

  @JsonProperty('product_discount_price', Number, true)
  product_discount_price = 0;

  @JsonProperty('product_original_price', Number, true)
  product_original_price = 0;

}
