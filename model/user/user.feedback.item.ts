import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model/json/json.serializable";
import { FeedbackOptionType } from "./user.feedback.item.option";
import { UserItemType } from "model/product/product.feedback.item.user";

interface UserFeedbackItemType {
  pk: Number,
  product: Number,
  user: UserItemType,
  is_anonymous: Boolean,
  order_item: Number,
  created_at: String,
  score: Number,
  content: String,
  store_name: String,
  product_name: String,
  image_1: String,
  image_2: String,
  image_3: String,
  image_4: String,
  image_5: String,
  product_id: Number,
  product_thumbnail_image: String,
  option: FeedbackOptionType
}

export type { UserFeedbackItemType };

@JsonObject("UserFeedbackItem")
export class UserFeedbackItem extends JsonSerializable<UserFeedbackItem> implements UserFeedbackItemType {
  protected get classRef(): new () => UserFeedbackItem {
    return UserFeedbackItem;
  }
  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('product', Number, true)
  product = 0;

  @JsonProperty('product_id', Number, true)
  product_id = 0;

  @JsonProperty('user', UserItemType, true)
  user = new UserItemType();

  @JsonProperty('is_anonymous', Boolean, true)
  is_anonymous = false;

  @JsonProperty('order_item', Number, true)
  order_item = 0;

  @JsonProperty('score', Number, true)
  score = 0;

  @JsonProperty('product_thumbnail_image', String, true)
  product_thumbnail_image = '';

  @JsonProperty('content', String, true)
  content = '';

  @JsonProperty('store_name', String, true)
  store_name = '';

  @JsonProperty('product_name', String, true)
  product_name = '';

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

  @JsonProperty('created_at', String, true)
  created_at = '';

  @JsonProperty('option', FeedbackOptionType, true)
  option = new FeedbackOptionType();
}