import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model/json/json.serializable";

@JsonObject("StoreAddress")
export class StoreAddress extends JsonSerializable<StoreAddress>{
    @JsonProperty('store', Number, false)
    store = '';
    @JsonProperty('address', String, true)
    address = '';
    @JsonProperty('google_map_url', String, true)
    google_map_url = '';
    @JsonProperty('ward', String, true)
    ward = '';
    @JsonProperty('district', String, true)
    district = '';
    @JsonProperty('province', String, true)
    province = '';
    @JsonProperty('X_axis', String, true)
    X_axis = '';
    @JsonProperty('Y_axis', String, true)
    Y_axis = '';

    protected get classRef() {
        return StoreAddress;
    };
}