import {
  JsonConverter,
  JsonObject,
  JsonProperty
} from 'json2typescript/src/json2typescript/json-convert-decorators';
import { EnumConverter, JsonSerializable } from 'model/json/json.serializable';
import { ProductSource } from 'model/product/ProductSource';

export interface StoreCollectionItem {
  pk: number;
  insta_id: string;
  profile_image: string;
  is_following: boolean;
}

@JsonObject('StoreCollectionItemImpl')
export class StoreCollectionItemImpl
  extends JsonSerializable<StoreCollectionItemImpl>
  implements StoreCollectionItem {
  protected get classRef(): new () => StoreCollectionItemImpl {
    return StoreCollectionItemImpl;
  }

  @JsonProperty('pk', Number, false)
  pk!: number;

  @JsonProperty('insta_id', String, true)
  insta_id = '';

  @JsonProperty('profile_image', String, true)
  profile_image = '';

  @JsonProperty('is_liked', Boolean, true)
  is_following = false;
}

export interface ProductCollectionItem {
  pk: number;
  name: string;
  store: string;
  original_price: number;
  discount_price?: number;
  discount_rate?: number;
  product_thumbnail_image: string;
  thumbnail_image?:string;
  original_thumbnail_image?:string;
  final_price: () => number;
  is_discount?: boolean;
}

@JsonObject('ProductCollectionItemImpl')
export class ProductCollectionItemImpl
  extends JsonSerializable<ProductCollectionItemImpl>
  implements ProductCollectionItem {
  @JsonProperty('pk', Number, false)
  pk!: number;

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('store', String, true)
  store = '';

  @JsonProperty('original_price', Number, true)
  original_price = 0;

  @JsonProperty('discount_price', Number, true)
  discount_price?: number;

  @JsonProperty('discount_rate', Number, true)
  discount_rate?: number;

  @JsonProperty('product_thumbnail_image', String, true)
  product_thumbnail_image = '';

  @JsonProperty('original_thumbnail_image', String, true)
  original_thumbnail_image = '';

  @JsonProperty('thumbnail_image', String, true)
  thumbnail_image = '';

  @JsonProperty('is_discount', Boolean, true)
  is_discount = false;

  final_price = () => {
    if (this.is_discount) return this.discount_price ?? 0;

    return this.original_price;
  };

  protected get classRef(): new () => ProductCollectionItemImpl {
    return ProductCollectionItemImpl;
  }
}

interface ProductNewestItem {
  pk: number;
  image: string;
}

@JsonObject('ProductNewestItemImpl')
export class ProductNewestItemImpl
  extends JsonSerializable<ProductNewestItemImpl>
  implements ProductNewestItem {
  protected get classRef(): new () => ProductNewestItemImpl {
    return ProductNewestItemImpl;
  }

  @JsonProperty('pk', Number, false)
  pk!: number;

  @JsonProperty('product_thumbnail_image', String, true)
  image = '';
}

export interface StoreLandingItem extends StoreCollectionItem {
  favorite_users_count: number;
  products: ProductNewestItem[];
  type: ProductSource;
}

@JsonConverter
class ProductSourceConverter extends EnumConverter<ProductSource> {
  constructor() {
    super(ProductSource, 'ProductSource',true);
  }
}
@JsonObject('StoreLandingItemImpl')
export class StoreLandingItemImpl extends StoreCollectionItemImpl implements StoreLandingItem {

  @JsonProperty('store_type', ProductSourceConverter, true)
  type = ProductSource.SHOPEE;

  @JsonProperty('favorite_users_count', Number, true)
  favorite_users_count = 0;

  @JsonProperty('newest_product', [ProductNewestItemImpl], true)
  products: ProductNewestItem[] = [];

  protected get classRef(): new () => StoreLandingItemImpl {
    return StoreLandingItemImpl;
  }
}
