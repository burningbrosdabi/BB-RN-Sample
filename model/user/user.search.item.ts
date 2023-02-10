import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model/json/json.serializable";

@JsonObject("SearchItem")
export class SearchItem extends JsonSerializable<SearchItem>{
  @JsonProperty('keyword', String, true)
  keyword = '';

  protected get classRef(): new () => SearchItem {
    return SearchItem;
  }
}