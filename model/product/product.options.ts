import {
  JsonObject,
  JsonProperty,
} from 'json2typescript/src/json2typescript/json-convert-decorators';
import { JsonSerializable } from 'model/json/json.serializable';

export interface OptionInterface {
  id: number;
  color?: string;
  size?: string;
  extra_option?: string;
  stock: number;
  original_price: number;
  discount_price: number;
  discount_rate: number;
}

// tslint:disable-next-line: no-unsafe-any
@JsonObject('ProductOption')
export class ProductOption extends JsonSerializable<ProductOption> implements OptionInterface {
  @JsonProperty('pk', Number, false)
  id!: number;

  @JsonProperty('color', String, true)
  color = '';

  @JsonProperty('size', String, true)
  size = '';

  @JsonProperty('extra_option', String, true)
  extra_option = '';

  @JsonProperty('stock', Number, true)
  stock = 0;

  @JsonProperty('original_price', Number, true)
  original_price = 0;

  @JsonProperty('discount_price', Number, true)
  discount_price = 0;

  @JsonProperty('discount_rate', Number, true)
  discount_rate = 0;

  get finalPrice(): number {
    if (this.discount_price > 0) {
      return this.discount_price;
    }

    return this.original_price;
  }

  protected get classRef(): new () => ProductOption {
    return ProductOption;
  }
}

export interface ICartProductOption extends OptionInterface {
  name?: string;
  product_thumbnail_image?: string;
  quantity: number;
}

@JsonObject('CartProductOption')
export class CartProductOption extends ProductOption implements ICartProductOption {
  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('product_pk', Number, true)
  product_pk = -1;

  @JsonProperty('product_thumbnail_image', String, true)
  product_thumbnail_image = '';

  @JsonProperty('quantity', Number, true)
  quantity = 0;

  @JsonProperty('item_id', Number, true)
  item_id = -1;

  protected get classRef(): new () => CartProductOption {
    return CartProductOption;
  }
}
