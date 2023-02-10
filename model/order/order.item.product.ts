import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

interface IOrderProductItem {
  pk: number,
  quantity: number,
  price: number,
  option_pk: number,
  option_size: string,
  option_color: string,
  option_extra_option: string,
  option_original_price: number,
  option_discount_price: number,
  option_discount_rate: number,
  option_currency: string,
  option_is_free_ship: boolean,
  option_name: string,
  option_stock: number,
  option_final_price: number,
  product_pk: number,
  product_name: string,
  product_product_image_type: string,
  product_is_discount: boolean,
  product_is_new: boolean,
  is_reviewed: boolean,
  is_exchanged: boolean,
  product_product_source: string,
  product_shopee_item_id: string,
  product_product_thumbnail_image: string,
  product_video_source: string
}

export type { IOrderProductItem };

@JsonObject('OrderProductItem')
export class OrderProductItem extends JsonSerializable<OrderProductItem> implements IOrderProductItem {
  protected get classRef(): new () => OrderProductItem {
    return OrderProductItem;
  }
  @JsonProperty('pk', Number, false)
  pk = 0

  @JsonProperty('quantity', Number, true)
  quantity = 0

  @JsonProperty('price', Number, true)
  price = 0

  @JsonProperty('option_pk', Number, true)
  option_pk = 0

  @JsonProperty('option_size', String, true)
  option_size = ''

  @JsonProperty('option_color', String, true)
  option_color = '';

  @JsonProperty('option_extra_option', String, true)
  option_extra_option = '';

  @JsonProperty('content', String, true)
  content = '';

  @JsonProperty('option_original_price', Number, true)
  option_original_price = 0;

  @JsonProperty('option_discount_price', Number, true)
  option_discount_price = 0;

  @JsonProperty('option_discount_rate', Number, true)
  option_discount_rate = 0;

  @JsonProperty('option_currency', String, true)
  option_currency = '';

  @JsonProperty('option_is_free_ship', Boolean, true)
  option_is_free_ship = false;

  @JsonProperty('option_name', String, true)
  option_name = '';

  @JsonProperty('option_stock', Number, true)
  option_stock = 0;

  @JsonProperty('option_final_price', Number, true)
  option_final_price = 0;

  @JsonProperty('product_pk', Number, true)
  product_pk = 0;

  @JsonProperty('product_name', String, true)
  product_name = '';

  @JsonProperty('product_product_image_type', String, true)
  product_product_image_type = '';

  @JsonProperty('product_is_discount', Boolean, true)
  product_is_discount = false;

  @JsonProperty('product_is_new', Boolean, true)
  product_is_new = false;

  @JsonProperty('is_reviewed', Boolean, true)
  is_reviewed = false;

  @JsonProperty('is_exchanged', Boolean, true)
  is_exchanged = false;

  @JsonProperty('product_product_source', String, true)
  product_product_source = '';

  @JsonProperty('product_shopee_item_id', String, true)
  product_shopee_item_id = '';

  @JsonProperty('product_product_thumbnail_image', String, true)
  product_product_thumbnail_image = '';

  @JsonProperty('product_video_source', String, true)
  product_video_source = '';
}
