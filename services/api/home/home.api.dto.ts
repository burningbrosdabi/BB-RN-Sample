import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model';

export interface BannerInterface {
  pk: number;
  cover_picture?: string;
  list_thumb_picture?: string;
  title?: string;
}

// tslint:disable-next-line: no-unsafe-any
@JsonObject('Banner')
export class Banner extends JsonSerializable<Banner> implements BannerInterface {
  protected get classRef(): new () => Banner {
    return Banner;
  }

  @JsonProperty('pk', Number, true)
  pk = 0;

  @JsonProperty('cover_picture', String, true)
  cover_picture? = '';

  @JsonProperty('list_thumb_picture', String, true)
  list_thumb_picture? = '';

  @JsonProperty('title', String, true)
  title? = '';
}
