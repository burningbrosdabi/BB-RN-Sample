// fields = [‘pk’, ‘image’, ‘original_image’, ‘image_outlink’, ‘outlink’, ‘primary_style_id’]

import { JsonObject, JsonProperty, } from "json2typescript";
import { JsonSerializable } from "model";
import { ProductColors, ProductColorsSerializer, StyleKey, StyleKeySerializer } from "utils/data";
import { Colors } from "styles";

export interface IPickItem {
    pk: number;
    image: string;
    original_image: string;
    primary_style_id: number;
}

@JsonObject('PickItem')
export class PickItem extends JsonSerializable<PickItem> implements IPickItem {
    protected get classRef(): new () => PickItem {
        return PickItem;
    }
    @JsonProperty('pk', Number, false)
    pk = 0;

    @JsonProperty('image', String, true)
    image = '';

    @JsonProperty('original_image', String, true)
    original_image = '';

    @JsonProperty('primary_style_id', Number, false)
    primary_style_id = 0;
}

export interface IPickAB {
    picks: IPickItem[]
}

@JsonObject('PickAB')
export class PickAB extends JsonSerializable<PickAB> implements IPickAB {
    protected get classRef(): new () => PickAB {
        return PickAB;
    }

    @JsonProperty('picks', [PickItem], false)
    picks: IPickItem[] = [];

}

interface IStylePoint {
    lovely: number,
    street: number,
    sexy: number,
    simple: number,
    feminine: number,
    office: number
}


@JsonObject('StylePoint')
export class StylePoint extends JsonSerializable<StylePoint> implements IStylePoint {
    protected get classRef(): new () => StylePoint {
        return StylePoint;
    }

    @JsonProperty('lovely', Number, true)
    lovely = 0
    @JsonProperty('street', Number, true)
    street = 0
    @JsonProperty('sexy', Number, true)
    sexy = 0
    @JsonProperty('simple', Number, true)
    simple = 0
    @JsonProperty('feminine', Number, true)
    feminine = 0
    @JsonProperty('office', Number, true)
    office = 0
}


export interface IPickResult {
    name: StyleKey,
    display_name: string,
    point: number,
    stylePoint: StylePoint,
    color: string;
    pct_of_same_style: number;
    is_shared: boolean
}


@JsonObject('PickResult')
export class PickResult extends JsonSerializable<PickResult> implements IPickResult {
    protected get classRef(): new () => PickResult {
        return PickResult;
    }

    @JsonProperty('name', StyleKeySerializer, false)
    name!: StyleKey;

    @JsonProperty('color_code', String, true)
    color = Colors.white;

    @JsonProperty('display_name', String, true)
    display_name = '';

    @JsonProperty('point', Number, true)
    point = 0;

    @JsonProperty('stylePoint', StylePoint, true)
    stylePoint: StylePoint = new StylePoint()

    @JsonProperty('pct_of_same_style', Number, true)
    pct_of_same_style = 0

    @JsonProperty('is_shared', Boolean, true)
    is_shared = false
}
