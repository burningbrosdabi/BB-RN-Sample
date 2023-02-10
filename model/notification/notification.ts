import { JsonObject, JsonProperty } from 'json2typescript';
import { DateConverter, JsonSerializable } from 'model/json/json.serializable';
import { UserItemType } from 'model/product/product.feedback.item.user';




@JsonObject('Sender')
export class Sender extends UserItemType {
  @JsonProperty('insta_id', String, true)
  insta_id= ""

  
  protected get classRef(): new () => Sender {
    return Sender;
  }
}
// tslint:disable-next-line: no-unsafe-any
@JsonObject('Notification')
export class Notification extends JsonSerializable<Notification> {
  @JsonProperty('title', String, true)
  title = '';

  @JsonProperty('route', String, true)
  route = '';

  @JsonProperty('body', String, true)
  body = '';

  @JsonProperty('publish_date', DateConverter, true)
  publish_date: Date | undefined = undefined;

  @JsonProperty('pk', Number, true)
  pk = 0;

  @JsonProperty('thumb_image', String, true)
  thumb_image = '';

  @JsonProperty('is_read', Boolean, true)
  is_read = false;

  @JsonProperty('sender', Sender, true)
  sender: Sender | undefined = undefined

  protected get classRef(): new () => Notification {
    return Notification;
  }
}
