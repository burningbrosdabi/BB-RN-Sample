import { Any, JsonObject, JsonProperty } from "json2typescript";
import { JsonConverter } from "json2typescript/src/json2typescript/json-convert-decorators";
import { EnumConverter, JsonSerializable } from "model";

export enum UserType {
    INFLUENCER = 'INFLUENCER',
    NORMAL = 'NORMAL',
    SUPPORTER = 'SUPPORTER',
    INTERNAL = 'INTERNAL',
    SELLER = 'SELLER',
    SYSTEM = 'SYSTEM'
}

interface SimplePostInfo {
    pk: number,
    thumbnail_image: string,
    post_thumb_image: string
}

export interface UserInfo {
    information_status?: string;
    region: number;
    user_type: UserType;
    user_id?: string;
    is_staff: boolean;
    id: number;
    insta_id?: string;
    facebook_id?: string;
    tiktok_id?: string;
    youtube_id?: string;
    etc_id?: string;
    insta_pk?: string;
    description: string;
    following: number;
    follower: number;
    post_count: number;
    email: string;
    name: string;
    phone_number?: string;
    age: string;
    height: number | undefined;
    weight: number | undefined;
    gender: string | undefined;
    get_user_favorite_stores_count: number;
    get_user_favorite_products_count: number;
    feedback_count: number;
    profile_image: string | undefined;
    is_require_fb_connect: boolean;
    order_count_summary: OrderSummary;
    is_pass_onboarding: boolean;
    primary_style?: string;
    secondary_style?: string
    recent_posts?: SimplePostInfo[]
}

interface OrderSummary {
    confirmed_count: number;
    waiting_count: number;
    shipping_count: number;
    shipped_count: number;
    cancel_count: number;
    exchange_refund_count: number;
}

@JsonConverter
export class UserTypeConverter extends EnumConverter<UserType> {
    constructor() {
        super(UserType, 'UserType');
    }
}

@JsonObject("UserInfoImpl")
export class OrderSummaryImpl extends JsonSerializable<OrderSummaryImpl> implements OrderSummary {
    @JsonProperty('cancel_count', Number, true)
    cancel_count = 0;

    @JsonProperty('confirmed_count', Number, true)
    confirmed_count = 0;

    @JsonProperty('exchange_refund_count', Number, true)
    exchange_refund_count = 0;

    @JsonProperty('shipped_count', Number, true)
    shipped_count = 0;

    @JsonProperty('shipping_count', Number, true)
    shipping_count = 0;

    @JsonProperty('waiting_count', Number, true)
    waiting_count = 0;

    protected get classRef() {
        return OrderSummaryImpl;
    }
}

@JsonObject("UserInfoImpl")
export class UserInfoImpl extends JsonSerializable<UserInfoImpl> implements UserInfo {

    @JsonProperty('is_staff', Boolean, true)
    is_staff = false;

    @JsonProperty('user_id', String, false)
    user_id = '';

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
    insta_pk = undefined;

    @JsonProperty('description', String, true)
    description = "";

    @JsonProperty('following', Number, true)
    following = 0;

    @JsonProperty('follower', Number, true)
    follower = 0;

    @JsonProperty('post_count', Number, true)
    post_count = 0;

    @JsonProperty('user_type', UserTypeConverter, true)
    user_type = UserType.NORMAL;

    @JsonProperty('age', String, true)
    age = '';

    @JsonProperty('email', String, true)
    email = '';

    @JsonProperty('feedback_count', Number, true)
    feedback_count = 0;

    @JsonProperty('get_user_favorite_products_count', Number, true)
    get_user_favorite_products_count = 0;

    @JsonProperty('get_user_favorite_stores_count', Number, true)
    get_user_favorite_stores_count = 0;

    @JsonProperty('id', Number, false)
    id!: number;

    @JsonProperty('information_status', String, true)
    information_status = '';

    @JsonProperty('is_require_fb_connect', Boolean, true)
    is_require_fb_connect = false;

    @JsonProperty('name', String, true)
    name = '';

    @JsonProperty('phone_number', String, true)
    phone_number?: string;

    @JsonProperty('region', Number, true)
    region = 0;

    @JsonProperty('order_count_summary', OrderSummaryImpl, true)
    order_count_summary: OrderSummary = {
        confirmed_count: 0,
        waiting_count: 0,
        shipping_count: 0,
        shipped_count: 0,
        cancel_count: 0,
        exchange_refund_count: 0,
    };

    @JsonProperty('gender', String, true)
    gender = undefined;

    @JsonProperty('height', Number, true)
    height = undefined;

    @JsonProperty('weight', Number, true)
    weight = undefined;

    @JsonProperty('profile_image', String, true)
    profile_image = undefined;

    @JsonProperty('is_pass_onboarding', Boolean, true)
    is_pass_onboarding = false;


    @JsonProperty('primary_style', String, true)
    primary_style = undefined;

    @JsonProperty('secondary_style', String, true)
    secondary_style = undefined;


    @JsonProperty('recent_posts', Any, true)
    recent_posts = [];


    protected get classRef() {
        return UserInfoImpl;
    }


}