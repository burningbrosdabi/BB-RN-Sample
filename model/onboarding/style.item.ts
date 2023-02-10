import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

// tslint:disable-next-line: no-unsafe-any
@JsonObject('StyleItem')
export default class StyleItem extends JsonSerializable<StyleItem> {
  @JsonProperty('pk', Number, true)
  pk = 0;

  @JsonProperty('image', String, true)
  image = '';

  @JsonProperty('image_outlink', String, true)
  image_outlink = '';

  @JsonProperty('outlink', String, true)
  outlink = '';

  @JsonProperty('product', Number, true)
  product = 0;

  protected get classRef() {
    return StyleItem;
  }

  static factory(pk: number, image: string, image_outlink?: string, outlink?: string, product?: number,) {
    const value = new StyleItem();
    value.pk = pk;
    value.image = image;
    value.image_outlink = image_outlink || '';
    value.outlink = outlink || '';
    value.product = product || 0 ;

    return value;
  }
}
