import { JsonObject, JsonProperty } from 'json2typescript';
import { FeedbackInfo } from 'model';
import { JsonSerializable } from 'model/json/json.serializable';
import { ProductInfo } from 'model/product/product';
import { ProductGroupItem } from './product.group.item';

interface MagazineType {
  pk: number;
  title: string;
  content: string;
  cover_picture: string;
  list_thumb_picture: string;
  product_list: ProductInfo[];
  productgroupdetails_set: ProductGroupItem[];
  total_comment: number;
}

export type { MagazineType };

@JsonObject('Magazine')
export class Magazine extends JsonSerializable<Magazine> implements MagazineType {
  protected get classRef(): new () => Magazine {
    return Magazine;
  }
  @JsonProperty('pk', Number, false)
  pk = 0;

  @JsonProperty('title', String, true)
  title = '';

  @JsonProperty('content', String, true)
  content = '';

  @JsonProperty('cover_picture', String, true)
  cover_picture = '';

  @JsonProperty('list_thumb_picture', String, true)
  list_thumb_picture = '';

  @JsonProperty('product_list', [ProductInfo], true)
  product_list: ProductInfo[] = [];

  @JsonProperty('productgroupdetails_set', [ProductGroupItem], true)
  productgroupdetails_set: ProductGroupItem[] = [];

  @JsonProperty('total_comment', Number, true)
  total_comment = 0;


}
