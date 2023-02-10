import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model/json/json.serializable";

@JsonObject("ProductCategory")
export default class ProductCategory extends JsonSerializable<ProductCategory>{

    @JsonProperty('display_name', String, true)
    display_name = '';

    @JsonProperty('name', String, true)
    name = '';

    protected get classRef() {
        return ProductCategory;
    };

}