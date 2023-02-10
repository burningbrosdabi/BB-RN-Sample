import {JsonObject, JsonProperty} from "json2typescript";
import {JsonSerializable, JSONType} from "model/json/json.serializable";
import {UserItemType} from "model/product/product.feedback.item.user";
import {isEmpty} from "lodash";

interface CommentItemType {
    id: number;
    created_at: string;
    updated_at: string;
    product_group: number;
    user: UserItemType;
    text: string;
    image_1: string;
    image_2: string;
    image_3: string;
    image_4: string;
    image_5: string;
    pk: number;
    sub_comments: CommentItemType[];
    is_liked:boolean,
    reaction_count:number
}

export enum CommentType {
    feed, magazine,
}

export type {CommentItemType};

@JsonObject("CommentItemModel")
export class CommentItemModel extends JsonSerializable<CommentItemModel> implements CommentItemType {
    protected get classRef(): new () => CommentItemModel {
        return CommentItemModel;
    }

    @JsonProperty('pk', Number, false)
    pk = 0;

    @JsonProperty('id', Number, false)
    id = 0;

    @JsonProperty('created_at', String, true)
    created_at = '';

    @JsonProperty('updated_at', String, true)
    updated_at = '';


    @JsonProperty('product_group', Number, true)
    product_group = 0;

    @JsonProperty('user', UserItemType, true)
    user = new UserItemType();

    @JsonProperty('text', String, true)
    text = '';

    @JsonProperty('image_1', String, true)
    image_1 = '';

    @JsonProperty('image_2', String, true)
    image_2 = '';

    @JsonProperty('image_3', String, true)
    image_3 = '';

    @JsonProperty('image_4', String, true)
    image_4 = '';

    @JsonProperty('image_5', String, true)
    image_5 = '';

    sub_comments : CommentItemType[] = [];

    reply?:number;

    is_liked = false;

    @JsonProperty('reaction_count', Number, true)
    reaction_count = 0;

    get images() {
        const images = [this.image_1, this.image_2, this.image_3, this.image_4, this.image_5];
        return images.filter((image) => !isEmpty(image)) ?? [];
    }

    fromJSON(json: JSONType): CommentItemModel {
        const result = super.fromJSON(json);
        if (!json.sub_comments) return result;
        result.sub_comments = (json.sub_comments as JSONType[]).map<CommentItemModel>((sub) => {
            return new CommentItemModel().fromJSON(sub);
        })
        return result;
    }
}

