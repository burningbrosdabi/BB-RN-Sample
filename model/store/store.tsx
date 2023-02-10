import { JsonObject, JsonProperty } from 'json2typescript';
import { EnumConverter, JsonSerializable } from 'model/json/json.serializable';
import { StoreAddress } from './store.address';
import ProductCategory from './store.product.category';
import { ProductColors } from 'utils/data';
import { JsonConverter } from 'json2typescript/src/json2typescript/json-convert-decorators';
import CertifiedMarkIcon from "assets/icons/store/CertifiedMarkIcon";
import KMarkIcon from "assets/icons/store/KMarkIcon";
import PartnershipMarkIcon from "assets/icons/store/PartnershipMarkIcon";
import React from 'react';
import {ProductSource, ProductSourceConverter} from "model/product/ProductSource";

export interface IStoreMinifiedInfo {
  pk: number;
  insta_id: string;
  name: string;
  profile_image: string;
}

interface StoreInfoInterface extends IStoreMinifiedInfo {
  cover_image: string;
  primary_style: string;
  secondary_style: string;
  age: any[];
  province_ids: any[];
  phone: string;
  facebook_id: string;
  facebook_numeric_id: string;
  shopee_numeric_id: string;
  favorite_users_count: number;
  store_address_set: StoreAddress[];
  product_category: ProductCategory[];
  recent_post_1: string;
  recent_post_2: string;
  store_type: ProductSource;
  is_following: boolean;
}

// tslint:disable-next-line: no-unsafe-any
@JsonObject('StoreMinifiedInfo')
export class StoreMinifiedInfo
  extends JsonSerializable<StoreMinifiedInfo>
  implements IStoreMinifiedInfo
{
  protected get classRef(): new () => StoreMinifiedInfo {
    return StoreMinifiedInfo;
  }

  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('insta_id', String, true)
  insta_id = '';

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('profile_image', String, true)
  profile_image = '';
}

// tslint:disable-next-line: no-unsafe-any
@JsonObject('StoreInfo')
export class StoreInfo extends StoreMinifiedInfo implements StoreInfoInterface {
  protected get classRef(): new () => StoreInfo {
    return StoreInfo;
  }

  @JsonProperty('cover_image', String, true)
  cover_image = '';

  @JsonProperty('primary_style', String, true)
  primary_style = '';

  @JsonProperty('secondary_style', String, true)
  secondary_style = '';

  @JsonProperty('age', [], true)
  age = [];

  @JsonProperty('province_ids', [], true)
  province_ids = [];

  @JsonProperty('phone', String, true)
  phone = '';

  @JsonProperty('facebook_id', String, true)
  facebook_id = '';

  @JsonProperty('facebook_numeric_id', String, true)
  facebook_numeric_id = '';

  @JsonProperty('shopee_numeric_id', String, true)
  shopee_numeric_id = '';

  @JsonProperty('favorite_users_count', Number, true)
  favorite_users_count = 0;

  @JsonProperty('store_address_set', [StoreAddress], true)
  store_address_set: StoreAddress[] = [];

  @JsonProperty('product_category', [ProductCategory], true)
  product_category: ProductCategory[] = [];

  @JsonProperty('recent_post_1', String, true)
  recent_post_1 = '';

  @JsonProperty('recent_post_2', String, true)
  recent_post_2 = '';

  @JsonProperty('store_type', ProductSourceConverter, true)
  store_type = ProductSource.HOMEPAGE;

  @JsonProperty('is_following', Boolean, true)
  is_following = false;
}

export interface StoreListItem extends IStoreMinifiedInfo {
  recent_post_1: string;
  recent_post_2: string;
  store_type: ProductSource;
}

@JsonObject('StoreListItemImpl')
export class StoreListItemImpl extends StoreMinifiedInfo implements StoreListItem {
  protected get classRef(): new () => StoreListItemImpl {
    return StoreListItemImpl;
  }

  @JsonProperty('recent_post_1', String, true)
  recent_post_1 = '';

  @JsonProperty('recent_post_2', String, true)
  recent_post_2 = '';

  @JsonProperty('store_type', ProductSourceConverter, true)
  store_type = ProductSource.HOMEPAGE;
}

export const getStoreTypeData = (type:ProductSource): { mark: JSX.Element; name: string } | undefined => {
  switch (type) {
    case ProductSource.CERTIFIED:
      return {
        mark: <CertifiedMarkIcon/>,
        name: 'Certified'
      }
    case ProductSource.KOREA:
      return {
        mark: <KMarkIcon/>,
        name: 'K-Fashion'
      }
    case ProductSource.PARTNERSHIP:
      return {
        mark: <PartnershipMarkIcon/>,
        name: 'Partnership'
      }
    case ProductSource.HOMEPAGE:
    case ProductSource.SHOPEE:
    default: return;
  }
};
