import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model/json/json.serializable";
import { UserItemType } from "./product.feedback.item.user";
import { FeedbackOptionType } from "model/user/user.feedback.item.option";

interface ProductUserFeedbackItemType {
  pk: Number;
  product: Number;
  user: UserItemType;
  is_anonymous: Boolean;
  order_item: Number;
  score: Number;
  content: String;
  image_1: String;
  image_2: String;
  image_3: String;
  image_4: String;
  image_5: String;
  option_color: String;
  option_size: String;
  option_extra_option: String;
  created_at: String;
  option: FeedbackOptionType;
}

export type { ProductUserFeedbackItemType };

@JsonObject("ProductUserFeedbackItem")
export class ProductUserFeedbackItem extends JsonSerializable<ProductUserFeedbackItem> implements ProductUserFeedbackItemType {
  protected get classRef(): new () => ProductUserFeedbackItem {
    return ProductUserFeedbackItem;
  }
  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('product', Number, true)
  product = 0;

  @JsonProperty('user', UserItemType, true)
  user = new UserItemType();

  @JsonProperty('is_anonymous', Boolean, true)
  is_anonymous = false;

  @JsonProperty('order_item', Number, true)
  order_item = 0;

  @JsonProperty('score', Number, true)
  score = 0;

  @JsonProperty('content', String, true)
  content = '';

  @JsonProperty('image_1', String, true)
  image_1 = '';

  @JsonProperty('image_2', String, true)
  image_2 = '';

  @JsonProperty('image_3', String, true)
  image_3 = '';

  @JsonProperty('image_4', String, true)
  image_4 = '';

  @JsonProperty('image_5', String, true)
  image_5 = '';

  @JsonProperty('option_color', String, true)
  option_color = '';

  @JsonProperty('option_size', String, true)
  option_size = '';

  @JsonProperty('option_extra_option', String, true)
  option_extra_option = '';

  @JsonProperty('created_at', String, true)
  created_at = '';

  @JsonProperty('option', FeedbackOptionType, true)
  option = new FeedbackOptionType();
}