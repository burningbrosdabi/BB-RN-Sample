import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';
import ProductSubcategory from './product.subcategory';

export interface IProductCategory {
  display_name: string;
  name: string;
}

// tslint:disable-next-line: no-unsafe-any
@JsonObject('ProductCategory')
export default class ProductCategory
  extends JsonSerializable<ProductCategory>
  implements IProductCategory {
  @JsonProperty('display_name', String, true)
  display_name = '';

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('productsubcategory_set', [ProductSubcategory], true)
  productsubcategory_set: ProductSubcategory[] = [];

  protected get classRef() {
    return ProductCategory;
  }
}
