import { JsonConverter, JsonCustomConvert, JsonObject, JsonProperty } from "json2typescript";
import { JsonSerializable, JSONType, ProductInfo } from "model";
import { get } from "lodash";
import { HandledError } from "error";

export enum RelatedProductSourceType {
    SHOPEE = 'SHOPEE',
    CERTIFIED = 'CERTIFIED',
    PARTNERSHIP = 'PARTNERSHIP',
    HOMEPAGE = 'HOMEPAGE',
    KOREA = 'KOREA',
    INSTAGRAM = 'INSTAGRAM',
}

export interface RelatedProduct {
    pk: number,
    thumbnail_image: string,
    store: string,
    name: string,
    discount_rate: number,
    discount_price: number,
    original_price: number,
    category: string;
    sub_category: string;
    out_link?: string,
    affiliate_link?: string;
    pinned_direction: number;
    pinned_position_x?: number,
    pinned_position_y?: number,
    product_name: string,
    product_pk?: number,
    is_product_active: boolean,
    is_new: boolean,
    is_discount: boolean,
    color?: string,
    size?: string,
    extra_option?: string,
    stock_available?: boolean
    product_source?: string
}

interface RelatedProductListResponse {
    count: number;
    results: JSONType[];
}

@JsonConverter
class CategoryConverter implements JsonCustomConvert<string> {
    serialize(value: string): object {
        return {};
    }

    deserialize = (value: object): string => {
        const name = get(value, 'name', 'all')
        return name;
    };
}


@JsonObject('RelatedProductImpl')
export class RelatedProductImpl extends JsonSerializable<RelatedProductImpl> implements RelatedProduct {

    protected get classRef() {
        return RelatedProductImpl;
    }
    @JsonProperty('is_discount', Boolean, true)
    is_discount = false

    @JsonProperty('discount_price', Number, true)
    discount_price = 0;

    @JsonProperty('discount_rate', Number, true)
    discount_rate = 0;

    @JsonProperty('original_price', Number, true)
    original_price = 0;

    @JsonProperty('name', String, true)
    name = '';

    @JsonProperty('pk', Number, false)
    pk!: number;

    @JsonProperty('thumbnail_image', String, true)
    thumbnail_image = '';

    @JsonProperty('store', String, true)
    store = '';

    @JsonProperty('category', CategoryConverter, true)
    category = 'all';

    @JsonProperty('sub_category', CategoryConverter, true)
    sub_category = 'all';

    @JsonProperty('pinned_direction', Number, true)
    pinned_direction = 1

    @JsonProperty('pinned_position_x', Number, true)
    pinned_position_x = undefined

    @JsonProperty('pinned_position_y', Number, true)
    pinned_position_y = undefined

    @JsonProperty('product_name', String, true)
    product_name = ''

    @JsonProperty('product_pk', Number, true)
    product_pk: undefined;

    @JsonProperty('out_link', String, true)
    out_link: undefined;

    @JsonProperty('affiliate_link', String, true)
    affiliate_link: undefined;

    @JsonProperty('is_product_active', Boolean, true)
    is_product_active = false

    @JsonProperty('is_new', Boolean, true)
    is_new = false

    @JsonProperty('color', String, true)
    color = undefined

    @JsonProperty('size', String, true)
    size = undefined

    @JsonProperty('extra_option', String, true)
    extra_option = undefined


    @JsonProperty('stock_available', Boolean, true)
    stock_available = false

    @JsonProperty('product_source', String, true)
    product_source = undefined

    static fromProductInfo(productInfo: ProductInfo): RelatedProduct {
        const product = new this();
        product.pk = productInfo.pk;
        product.thumbnail_image = productInfo.thumbnail_image;
        product.store = productInfo.store;
        product.name = productInfo.name;
        product.discount_rate = productInfo.discount_rate;
        product.discount_price = productInfo.discount_price;
        product.original_price = productInfo.original_price;
        return product;
    }
}

export class RelatedProductListDTO {
    totalCount: number;
    data: RelatedProductImpl[];

    constructor({ count, results }: RelatedProductListResponse) {
        this.totalCount = count ?? 0;
        this.data = [];
        if (!results) this.data = [];
        else {
            try {
                this.data = new RelatedProductImpl().fromListJSON(results) as RelatedProductImpl[];
            } catch (error) {
                throw new HandledError({ error: error as Error, stack: 'RelatedProductListDTO.constructor' });
            }
        }
    }
}

export type {
    RelatedProductListResponse
};
