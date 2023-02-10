import { JsonConverter } from "json2typescript";
import { EnumConverter } from "model";

export enum ProductSource {
    SHOPEE = 'SHOPEE',
    CERTIFIED = 'CERTIFIED',
    PARTNERSHIP = 'PARTNERSHIP',
    HOMEPAGE = 'HOMEPAGE',
    KOREA = 'KOREA',
    INSTAGRAM = 'INSTAGRAM',

}

@JsonConverter
export class ProductSourceConverter extends EnumConverter<ProductSource> {
    constructor() {
        super(ProductSource, "ProductSource", true);
    }
}