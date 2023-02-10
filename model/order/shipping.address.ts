import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';

interface IShippingAddress {
  id: Number,
  recipient_name: String,
  contact_number: String,
  country: String,
  ward: String,
  additional_address: String,
  user: Number,
  primary: Boolean,
  pk: Number,
  province: String,
  district: String,
  ward_id: Number,
  district_id: Number,
  province_id: Number,
}

export type { IShippingAddress };

@JsonObject('ShippingAddress')
export class ShippingAddress extends JsonSerializable<ShippingAddress> implements IShippingAddress {
  protected get classRef(): new () => ShippingAddress {
    return ShippingAddress;
  }
  @JsonProperty('pk', Number, false)
  pk = 0

  @JsonProperty('id', Number, true)
  id = 0

  @JsonProperty('ward_id', Number, true)
  ward_id = 0

  @JsonProperty('district_id', Number, true)
  district_id = 0

  @JsonProperty('province_id', Number, true)
  province_id = 0

  @JsonProperty('user', Number, true)
  user = 0

  @JsonProperty('recipient_name', String, true)
  recipient_name = ''

  @JsonProperty('contact_number', String, true)
  contact_number = '';

  @JsonProperty('country', String, true)
  country = '';

  @JsonProperty('ward', String, true)
  ward = '';

  @JsonProperty('district', String, true)
  district = '';

  @JsonProperty('province', String, true)
  province = '';

  @JsonProperty('additional_address', String, true)
  additional_address = '';

  @JsonProperty('primary', Boolean, true)
  primary = false;
}
