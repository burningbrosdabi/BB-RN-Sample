import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model/json/json.serializable";


// tslint:disable-next-line: no-unsafe-any
@JsonObject("ProductSubcategory")
export default class ProductSubcategory extends JsonSerializable<ProductSubcategory> {

    protected get classRef() {
        return ProductSubcategory;
    }

    @JsonProperty('display_name', String, true)
    display_name = '';

    @JsonProperty('name', String, true)
    name = '';

    @JsonProperty('is_active', Boolean, true)
    is_active = true;

    static factory({
        display_name, name, is_active
    }: {
        display_name: string,
        name: string,
        is_active: boolean
    }
    ): ProductSubcategory {
        const value = new ProductSubcategory();
        value.display_name = display_name;
        value.name = name;
        value.is_active = is_active;

        return value;
    }
}