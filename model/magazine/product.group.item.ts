import { Any, JsonObject, JsonProperty } from 'json2typescript';
import { FeedbackInfo } from 'model';
import { JsonSerializable } from 'model/json/json.serializable';

interface IProductGroupItem {
  ordering: number;
  content: string;
  cover_picture: string;
  related_feed?: FeedbackInfo;

}

export type { IProductGroupItem };

@JsonObject('ProductGroupItem')
export class ProductGroupItem extends JsonSerializable<ProductGroupItem> implements IProductGroupItem {
  protected get classRef(): new () => ProductGroupItem {
    return ProductGroupItem;
  }
  @JsonProperty('ordering', Number, true)
  ordering = 0

  @JsonProperty('content', String, true)
  content = '';

  @JsonProperty('cover_picture', String, true)
  cover_picture = '';

  @JsonProperty('related_feed', Any, true)
  related_feed = undefined
}
