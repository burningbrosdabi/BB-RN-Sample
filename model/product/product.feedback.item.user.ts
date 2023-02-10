import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonSerializable } from 'model/json/json.serializable';
import { UserType, UserTypeConverter } from "model/user/user";

interface IUserItemType {
    user_type: UserType;
    pk: number;
    name: string;
    profile_image: string;
    weight?: number;
    height?: number;
    user_id?: string;
    // insta_id: String;
    // insta_pk: String;
    // email: String;
    // gender: string;
}

export type { IUserItemType };

@JsonObject('UserItemType')
export class UserItemType extends JsonSerializable<UserItemType> implements IUserItemType {

    protected get classRef(): new () => UserItemType {
        return UserItemType;
    }

    @JsonProperty('pk', Number, false)
    pk = 0

    @JsonProperty('user_type', UserTypeConverter, true)
    user_type = UserType.NORMAL

    @JsonProperty('name', String, true)
    name = 'Ẩn danh'

    @JsonProperty('user_id', String, true)
    user_id = ''

    @JsonProperty('profile_image', String, true)
    profile_image = ''

    @JsonProperty('weight', Number, true)
    weight = undefined

    @JsonProperty('height', Number, true)
    height = undefined

    // @JsonProperty('email', String, true)
    // email = ''

    // @JsonProperty('gender', String, true)
    // gender = ''


}
