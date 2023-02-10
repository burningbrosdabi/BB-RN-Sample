import { JsonConverter, JsonObject, JsonProperty } from 'json2typescript';
import { EnumConverter, JsonSerializable } from 'model/json/json.serializable';
import { StoreInfo } from '../store/store';
import ProductCategory from './product.category';
import ProductSubcategory from './product.subcategory';
import { ProductSource, ProductSourceConverter } from "model/product/ProductSource";

type Store = string | StoreInfo;
interface ProductInfoInterface {
  pk: number;
  is_new: boolean;
  is_liked: boolean;
  is_feedback_exist: boolean;
  name: string;
  product_thumbnail_image: string;
  thumbnail_image: string;
  original_thumbnail_image: string;
  is_discount: boolean;
  original_price: number;
  discount_price: number;
  discount_rate: number;
  favorite_users_count: number;
  affiliate_link?: string;
}
interface IProductImageSet {
  source_thumb: string;
  post_image_type: string;
  source: string;
}

interface IProductColor {
  display_name: string;
  name: string;
  pk: number;
}

export interface IProduct extends ProductInfoInterface {
  product_source: ProductSource;
  product_link: string;
  description: string;
  product_image_type: string;
  product_image_set: ProductImageSet[];
  is_free_ship: boolean;
  sold: number;
  stock: number;
  size: string[];
  category: ProductCategory;
  sub_category: ProductSubcategory;
  style?: string;
  color: ProductColor[];
}

@JsonObject('ProductImageSet')
export class ProductImageSet extends JsonSerializable<ProductImageSet> implements IProductImageSet {
  protected get classRef(): new () => ProductImageSet {
    return ProductImageSet;
  }

  @JsonProperty('source_thumb', String, true)
  source_thumb = '';

  @JsonProperty('post_image_type', String, true)
  post_image_type = '';

  @JsonProperty('source', String, true)
  source = '';
}
@JsonObject('ProductColor')
export class ProductColor extends JsonSerializable<ProductColor> implements IProductColor {
  protected get classRef(): new () => ProductColor {
    return ProductColor;
  }
  @JsonProperty('display_name', String, true)
  display_name = '';

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('color_code', String, true)
  color_code = '';

  @JsonProperty('pk', Number, true)
  pk = 0;
}

// tslint:disable-next-line: no-unsafe-any
@JsonObject('ProductInfoGeneric')
export class ProductInfoGeneric
  extends JsonSerializable<ProductInfoGeneric>
  implements ProductInfoInterface {
  protected get classRef(): new () => ProductInfoGeneric {
    return ProductInfoGeneric;
  }

  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('is_new', Boolean, true)
  is_new = false;

  @JsonProperty('is_liked', Boolean, true)
  is_liked = false;

  @JsonProperty('is_feedback_exist', Boolean, true)
  is_feedback_exist = false;

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('product_thumbnail_image', String, true)
  product_thumbnail_image = '';

  @JsonProperty('original_thumbnail_image', String, true)
  original_thumbnail_image = '';

  @JsonProperty('thumbnail_image', String, true)
  thumbnail_image = '';

  @JsonProperty('is_discount', Boolean, true)
  is_discount = false;

  @JsonProperty('original_price', Number, true)
  original_price = 0;

  @JsonProperty('discount_price', Number, true)
  discount_price = 0;

  @JsonProperty('discount_rate', Number, true)
  discount_rate = 0;

  @JsonProperty('favorite_users_count', Number, true)
  favorite_users_count = 0;

  @JsonProperty('affiliate_link', String, true)
  affiliate_link = undefined

  static factory({
    pk,
    is_feedback_exist,
    name,
    product_thumbnail_image,
    is_discount,
    original_price,
    discount_price,
    discount_rate,
    favorite_users_count,
  }: ProductInfoInterface) {
    const value = new ProductInfoGeneric();
    value.pk = pk;
    value.is_feedback_exist = is_feedback_exist;
    value.name = name;
    value.product_thumbnail_image = product_thumbnail_image;
    value.is_discount = is_discount;
    value.original_price = original_price;
    value.discount_price = discount_price;
    value.discount_rate = discount_rate;
    value.favorite_users_count = favorite_users_count;

    return value;
  }
}

@JsonObject('ProductInfo')
export class ProductInfo extends ProductInfoGeneric {
  @JsonProperty('store', String, true)
  store = '';

  @JsonProperty('product_source', ProductSourceConverter, true)
  product_source = ProductSource.SHOPEE;

  protected get classRef(): new () => ProductInfo {
    return ProductInfo;
  }
}

@JsonObject('ProductDetail')
export class ProductDetail extends ProductInfoGeneric implements IProduct {
  protected get classRef(): new () => ProductDetail {
    return ProductDetail;
  }

  @JsonProperty('store', StoreInfo, true)
  store = new StoreInfo();

  @JsonProperty('product_source', ProductSourceConverter, true)
  product_source = ProductSource.SHOPEE;

  @JsonProperty('product_thumbnail_image', String, true)
  product_thumbnail_image = '';

  @JsonProperty('original_thumbnail_image', String, true)
  original_thumbnail_image = '';

  @JsonProperty('product_link', String, true)
  product_link = '';

  @JsonProperty('description', String, true)
  description = '';

  @JsonProperty('product_image_type', String, true)
  product_image_type = '';

  @JsonProperty('product_image_set', [ProductImageSet], true)
  product_image_set: ProductImageSet[] = [];

  @JsonProperty('is_free_ship', Boolean, true)
  is_free_ship = false;

  @JsonProperty('sold', Number, true)
  sold = 0;

  @JsonProperty('stock', Number, true)
  stock = 0;

  @JsonProperty('size', [String], true)
  size: string[] = [];

  @JsonProperty('category', ProductCategory, true)
  category = new ProductCategory();

  @JsonProperty('sub_category', ProductSubcategory, true)
  sub_category = new ProductSubcategory();

  @JsonProperty('style', String, true)
  style = undefined

  @JsonProperty('color', [ProductColor], true)
  color: ProductColor[] = [];

  @JsonProperty('affiliate_link', String, true)
  affiliate_link = undefined
}
