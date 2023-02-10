import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable, JSONType, Notification } from 'model';

interface NotificationResponseInterface {
  next: number | null;
  results: JSONType[];
}

// tslint:disable-next-line: no-unsafe-any
@JsonObject('NotificationResponse')
export class NotificationResponse extends JsonSerializable<NotificationResponse> {
  protected get classRef(): new () => NotificationResponse {
    return NotificationResponse;
  }
  //   count: number | null;
  //   previous: number | null;

  @JsonProperty('next', String, true)
  next: string | null = null;

  @JsonProperty('results', [Notification], false)
  results: Notification[] = [];

  @JsonProperty('unread_count', Number, true)
  unread_count = 0
}

export type { NotificationResponseInterface };
