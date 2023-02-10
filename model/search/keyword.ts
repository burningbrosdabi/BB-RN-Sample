import { JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable } from "model";

export interface UserKeyword {
    id: number,
    user_id: string,
    name: string,
    profile_image: string,
}

export interface Keyword {
    pk: number,
    keyword: string,
}

export interface HashTag {
    text: string,
}

@JsonObject('HashTagImpl')
export class HashTagImpl
    extends JsonSerializable<HashTagImpl>
    implements HashTag {

    protected get classRef() {
        return HashTagImpl;
    }

    @JsonProperty('text', String, true)
    text = '';

}

@JsonObject('KeywordImpl')
export class KeywordImpl
    extends JsonSerializable<KeywordImpl>
    implements Keyword {

    protected get classRef() {
        return KeywordImpl;
    }

    @JsonProperty('keyword', String, true)
    keyword = '';

    @JsonProperty('pk', Number, false)
    pk!: number;

}

@JsonObject('UserKeywordImpl')
export class UserKeywordImpl
    extends JsonSerializable<UserKeywordImpl>
    implements UserKeyword {

    protected get classRef() {
        return UserKeywordImpl;
    }

    @JsonProperty('user_id', String, true)
    user_id = '';

    @JsonProperty('name', String, true)
    name = '';

    @JsonProperty('id', Number, false)
    id!: number;

    @JsonProperty('profile_image', String, true)
    profile_image = '';

}