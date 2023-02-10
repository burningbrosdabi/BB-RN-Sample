import { Any, JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from 'json2typescript';
import { get } from "lodash";
import { IStoreMinifiedInfo, StoreMinifiedInfo } from 'model';
import { JsonSerializable } from 'model/json/json.serializable';
import { CommentItemModel } from 'model/magazine/comment.item';
import { UserItemType } from 'model/product/product.feedback.item.user';
import { RelatedProduct, RelatedProductImpl } from "model/product/related.product";

@JsonConverter
export class ColorConverter implements JsonCustomConvert<string[]> {
  serialize(value: string[]): object[] {
    return [];
  }

  deserialize = (values: object[]): string[] => {
    const colors = [];
    for (const value of values) {
      const name = get(value, 'name',)
      if (name) colors.push(name);
    }
    return colors;
  };
}


interface IPostImageSet {
  source: string;
}

interface FeedbackType {
  pk: number;
  influencer: UserItemType
  post_url: string;
  post_id: string;
  post_thumb_image: string;
  post_taken_at_timestamp: string;
  post_description?: string;
  related_product?: RelatedProduct[];
  total_comment: number,
  comments: CommentItemModel[];
  like_count: number,
  thumbnail_image?: string,
  influencerpostimage_set?: IPostImageSet[],
  is_collected: boolean,
  is_liked: boolean,
  promotion_started_at?: string,
  promotion_end_at?: string,
  store?: IStoreMinifiedInfo
  is_promotion_ended?: boolean,
  created_at?: string
  media_type: number;
  video?: string
}

interface BusinessCategoryType {
  display_name?: string;
}

interface LocationType {
  pk?: number;
  name?: string
  ward?: string;
  additional_address?: string;
  opening_hour?: string;
  google_map_url?: string;
  hashtags?: string[]
  preview_image?: string
  business_category?: BusinessCategory
  is_active?: boolean
}

export type { FeedbackType, LocationType };

@JsonObject('BusinessCategory')
export class BusinessCategory extends JsonSerializable<BusinessCategory> implements BusinessCategoryType {
  protected get classRef(): new () => BusinessCategory {
    return BusinessCategory;
  }
  @JsonProperty('display_name', String, true)
  display_name = ''
}

@JsonObject('Location')
export class Location extends JsonSerializable<Location> implements LocationType {
  protected get classRef(): new () => Location {
    return Location;
  }
  @JsonProperty('pk', Number, true)
  pk = 1

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('ward', String, true)
  ward = '';

  @JsonProperty('additional_address', String, true)
  additional_address = '';

  @JsonProperty('opening_hour', String, true)
  opening_hour = '';

  @JsonProperty('google_map_url', String, true)
  google_map_url = '';

  @JsonProperty('hashtags', [String], true)
  hashtags = []

  @JsonProperty('preview_image', String, true)
  preview_image = '';

  @JsonProperty('business_category', BusinessCategory, true)
  business_category = undefined

  @JsonProperty('is_active', Boolean, true)
  is_active = true
}



@JsonObject('PostImageSet')
export class PostImageSet extends JsonSerializable<PostImageSet> implements IPostImageSet {
  protected get classRef(): new () => PostImageSet {
    return PostImageSet;
  }

  @JsonProperty('source', String, true)
  source = '';
}

@JsonObject('FeedbackInfo')
export class FeedbackInfo extends JsonSerializable<FeedbackInfo> implements FeedbackType {
  protected get classRef(): new () => FeedbackInfo {
    return FeedbackInfo;
  }
  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('influencer', UserItemType, true)
  influencer = new UserItemType();

  @JsonProperty('post_url', String, true)
  post_url = '';

  @JsonProperty('post_id', String, true)
  post_id = '';

  @JsonProperty('post_thumb_image', String, true)
  post_thumb_image = '';

  @JsonProperty('thumbnail_image', String, true)
  thumbnail_image = '';

  @JsonProperty('post_taken_at_timestamp', String, true)
  post_taken_at_timestamp = '';

  @JsonProperty('created_at', String, true)
  created_at = '';

  @JsonProperty('post_description', String, true)
  post_description = '';

  @JsonProperty('related_products', [RelatedProductImpl], true)
  related_products?: RelatedProduct[] = [];

  @JsonProperty('total_comment', Number, true)
  total_comment = 0;

  @JsonProperty('comments', [CommentItemModel], true)
  comments: CommentItemModel[] = [];

  @JsonProperty('like_count', Number, true)
  like_count = 0;

  @JsonProperty('influencerpostimage_set', [PostImageSet], true)
  influencerpostimage_set?: IPostImageSet[] = [];

  @JsonProperty('is_collected', Boolean, true)
  is_collected = false;

  @JsonProperty('is_liked', Boolean, true)
  is_liked = false;

  @JsonProperty('promotion_started_at', String, true)
  promotion_started_at?= undefined;

  @JsonProperty('promotion_end_at', String, true)
  promotion_end_at?= undefined;

  @JsonProperty('store', StoreMinifiedInfo, true)
  store?= new StoreMinifiedInfo()

  @JsonProperty('is_promotion_ended', Boolean, true)
  is_promotion_ended = true;


  @JsonProperty('media_type', Number, true)
  media_type = 0;

  @JsonProperty('video', String, true)
  video = undefined;

  @JsonProperty('location', Location, true)
  location = undefined
}