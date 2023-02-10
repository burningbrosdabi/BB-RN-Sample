import {
  JsonObject,
  JsonProperty
} from 'json2typescript/src/json2typescript/json-convert-decorators';
import { JsonSerializable } from 'model/json/json.serializable';
import { UserType, UserTypeConverter } from 'model/user/user';

export interface InfluencerInteface {
  pk: number;
  name?: string;
  profile_image?: string;
  insta_id?: string;
  facebook_id?: string;
  tiktok_id?: string;
  youtube_id?: string;
  etc_id?: string;
  insta_pk?: string;
  description?: string;
  is_following?: boolean;
  following?: number;
  follower?: number;
  post_count?: number;
  user_type: UserType;
  height: number | undefined;
  weight: number | undefined;
  user_id: string;
  primary_style?: string;
  secondary_style?: string
}

@JsonObject('Influencer')
export class Influencer extends JsonSerializable<Influencer> implements InfluencerInteface {
  @JsonProperty('id', Number, true)
  pk!: number;

  @JsonProperty('name', String, true)
  name = '';

  @JsonProperty('user_id', String, false)
  user_id = '';

  @JsonProperty('profile_image', String, true)
  profile_image?: string;

  @JsonProperty('insta_id', String, true)
  insta_id = undefined;

  @JsonProperty('facebook_id', String, true)
  facebook_id = undefined;

  @JsonProperty('tiktok_id', String, true)
  tiktok_id = undefined;

  @JsonProperty('youtube_id', String, true)
  youtube_id = undefined;

  @JsonProperty('etc_id', String, true)
  etc_id = undefined;

  @JsonProperty('insta_pk', String, true)
  insta_pk = '';

  @JsonProperty('description', String, true)
  description = '';

  @JsonProperty('is_following', Boolean, true)
  is_following = false;

  @JsonProperty('following', Number, true)
  following = 0;

  @JsonProperty('follower', Number, true)
  follower = 0;

  @JsonProperty('post_count', Number, true)
  post_count = 0;

  @JsonProperty('user_type', UserTypeConverter, true)
  user_type = UserType.NORMAL;

  @JsonProperty('height', Number, true)
  height = undefined;

  @JsonProperty('weight', Number, true)
  weight = undefined;

  @JsonProperty('primary_style', String, true)
  primary_style = undefined;

  @JsonProperty('secondary_style', String, true)
  secondary_style = undefined;


  protected get classRef(): new () => Influencer {
    return Influencer;
  }
}


