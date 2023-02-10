import { ImageRequireSource } from 'react-native';
import { Spacing } from 'styles';
import { EnumConverter } from "model";
import { ItemTransition } from "model/collection";
import { JsonConverter } from "json2typescript";

const ASPECT_RATIO_W = 265 / 360;
export const MAP_WIDTH = Spacing.screen.width * ASPECT_RATIO_W;

export type PatternKey = 'print' | 'floral' | 'caro' | 'polka' | 'striped' | 'texture' | 'tiedye' | 'leopard';

export interface IPattern {
    image: ImageRequireSource;
    key: PatternKey;
    description: string;
}

export const patternList: IPattern[] = [
    {
        image: require('_assets/images/pattern/pattern_nopattern.png'),
        key: 'print',
        description: 'Hình in',
    },
    {
        image: require('_assets/images/pattern/pattern_floral.png'),
        key: 'floral',
        description: 'Hoa',
    },
    {
        image: require('_assets/images/pattern/pattern_caro.png'),
        key: 'caro',
        description: 'Caro',
    },
    {
        image: require('_assets/images/pattern/pattern_dot.png'),
        key: 'polka',
        description: 'Chấm bi',
    },
    {
        image: require('_assets/images/pattern/pattern_stripe.png'),
        key: 'striped',
        description: 'Sọc',
    },
    {
        image: require('_assets/images/pattern/pattern_texture.png'),
        key: 'texture',
        description: 'Hoạ tiết',
    },
    {
        image: require('_assets/images/pattern/pattern_tiedye.png'),
        key: 'tiedye',
        description: 'Màu loang',
    },
    {
        image: require('_assets/images/pattern/pattern_leopard.png'),
        key: 'leopard',
        description: 'Da báo',
    },
];

export enum ProductColors {
    white = 'white',
    grey = 'grey',
    black = 'black',
    beige = 'beige',
    brown = 'brown',
    red = 'red',
    orange = 'orange',
    yellow = 'yellow',
    pink = 'pink',
    purple = 'purple',
    blue = 'blue',
    green = 'green',
    multiple = 'multiple'
}

@JsonConverter
export class ProductColorsSerializer extends EnumConverter<ProductColors> {
    constructor() {
        super(ProductColors, 'ProductColors');
    }
}


export const colorList: {
    color: string | undefined;
    key: string;
    description: string;
    colorCheck?: boolean;
}[] = [
        { color: '#ffffff', key: ProductColors.white, description: 'Trắng', colorCheck: true },
        { color: '#a6a7a8', key: ProductColors.grey, description: 'Xám' },
        { color: '#222222', key: ProductColors.black, description: 'Đen' },
        { color: '#EDC7A2', key: ProductColors.beige, description: 'Be', colorCheck: true },
        { color: '#b16f42', key: ProductColors.brown, description: 'Nâu' },
        { color: '#fc4532', key: ProductColors.red, description: 'Đỏ' },
        { color: '#ff7e29', key: ProductColors.orange, description: 'Cam' },
        { color: '#FFCE00', key: ProductColors.yellow, description: 'Vàng', colorCheck: true },
        { color: '#f8b9c7', key: ProductColors.pink, description: 'Hồng' },
        { color: '#ba7cd1', key: ProductColors.purple, description: 'Tím' },
        { color: '#1a81d3', key: ProductColors.blue, description: 'Xanh Đậm' },
        { color: '#31c969', key: ProductColors.green, description: 'Xanh Lá' },
        { color: undefined, key: ProductColors.multiple, description: 'Nhiều màu' }
    ];


export const colorMap: { [key in ProductColors]: string | undefined } = {
    [ProductColors.white]: '#ffffff',
    [ProductColors.grey]: '#a6a7a8',
    [ProductColors.black]: '#222222',
    [ProductColors.beige]: '#EDC7A2',
    [ProductColors.brown]: '#b16f42',
    [ProductColors.red]: '#fc4532',
    [ProductColors.orange]: '#ff7e29',
    [ProductColors.yellow]: '#FFCE00',
    [ProductColors.pink]: '#f8b9c7',
    [ProductColors.purple]: '#ba7cd1',
    [ProductColors.blue]: '#1a81d3',
    [ProductColors.green]: '#31c969',
    [ProductColors.multiple]: undefined
}

export enum StyleKey {
    street = 'street',
    simple = 'simple',
    sexy = 'sexy',
    lovely = 'lovely',
    feminine = 'feminine',
    office = 'office',
};

export const styleList: { description: string; key: StyleKey, test_pk: number }[] = [
    { description: 'Đường phố', key: StyleKey.street, test_pk: 2 },
    { description: 'Đơn giản', key: StyleKey.simple, test_pk: 5 },
    { description: 'Gợi cảm', key: StyleKey.sexy, test_pk: 3 },
    { description: 'Đáng yêu', key: StyleKey.lovely, test_pk: 1 },
    { description: 'Nữ tính', key: StyleKey.feminine, test_pk: 6 },
    { description: 'Công sở', key: StyleKey.office, test_pk: 7 }
];

export enum heightKey {
    'min' = 'undefined,150',
    '155cm' = '151,155',
    '160cm' = '156,160',
    '165cm' = '161,165',
    '170cm' = '166,170',
    'max' = '170,undefined',

}

export const heightList: { description: string; key: heightKey, model_height_min?: number, model_height_max?: number }[] = [
    { description: '~150cm', key: heightKey.min, model_height_max: 150 },
    { description: '151~155cm', key: heightKey['155cm'], model_height_min: 151, model_height_max: 155 },
    { description: '156~160cm', key: heightKey['160cm'], model_height_min: 156, model_height_max: 160 },
    { description: '161~165cm', key: heightKey['165cm'], model_height_min: 161, model_height_max: 165 },
    { description: '166~170cm', key: heightKey['170cm'], model_height_min: 166, model_height_max: 170 },
    { description: '171cm~', key: heightKey.max, model_height_min: 171, }
];

export enum weightKey {
    'min' = 'undefined,40',
    '48kg' = '41,48',
    '56kg' = '49,56',
    '64kg' = '57,undefined',
    // '72kg' = '65,72',
    // 'max' = '73,undefined',

}

export const weightList: { description: string; key: weightKey, model_weight_min?: number, model_weight_max?: number }[] = [
    { description: '~40kg', key: weightKey.min, model_weight_max: 40 },
    { description: '41~45kg', key: weightKey['48kg'], model_weight_min: 41, model_weight_max: 45 },
    { description: '46~50kg', key: weightKey['56kg'], model_weight_min: 46, model_weight_max: 50 },
    { description: '51kg~', key: weightKey['64kg'], model_weight_min: 51, },
    // { description: '65~72kg', key: weightKey['72kg'], model_weight_min: 65, model_weight_max: 72 },
    // { description: '73kg~', key: weightKey.max, model_weight_min: 73 }
];



export const styleNameMap: { [key in StyleKey]: string } = {
    street: 'Đường phố',
    simple: 'Đơn giản',
    sexy: 'Gợi cảm',
    lovely: 'Đáng yêu',
    feminine: 'Nữ tính',
    office: 'Công sở'
}

export const priceList = [
    { minPrice: 0, maxPrice: 100000, key: '100k', description: '~100k' },
    { minPrice: 100000, maxPrice: 200000, key: '200k', description: '100k~200k' },
    { minPrice: 200000, maxPrice: 300000, key: '300k', description: '200k~300k' },
    { minPrice: 300000, maxPrice: 400000, key: '400k', description: '300k~400k' },
    { minPrice: 400000, maxPrice: 500000, key: '500k', description: '400k~500k' },
    {
        minPrice: 500000,
        maxPrice: 'unlimited',
        key: 'unlimited',
        description: '500k~',
    },
];

export type AgeKey = '15-18' | '19-24' | 'FROM_25';

export const ageList: { description: string; key: AgeKey; id: number; }[] = [
    { description: '15-18', key: '15-18', id: 0 },
    { description: '19-24', key: '19-24', id: 1 },
    { description: 'Trên 25', key: 'FROM_25', id: 2 },
];

export const cityList = [
    {
        latlng: {
            latitude: 21.028266718788913,
            longitude: 105.83550442958082,
        },
        xLocation: 0.55 * MAP_WIDTH,
        yLocation: 0.11,
        title: 'Ha Noi',
        image: require('_assets/images/fontable/location_marker.png'),
        description: 'Hà Nội',
        key: 'hanoi',
        id: 63,
        index: 0,
    },
    {
        latlng: {
            latitude: 16.054424565887516,
            longitude: 108.20395886148644,
        },
        xLocation: 0.24 * MAP_WIDTH,
        yLocation: 0.44,
        title: 'Da Nang',
        image: require('_assets/images/fontable/location_marker.png'),
        description: 'Đà Nẵng',
        key: 'danang',
        id: 61,
        index: 1,
    },
    {
        latlng: {
            latitude: 10.780299623208968,
            longitude: 106.68282788810512,
        },
        xLocation: 0.42 * MAP_WIDTH,
        yLocation: 0.79,
        title: 'Ho Chi Minh',
        image: require('_assets/images/fontable/location_marker.png'),
        description: 'Hồ Chí Minh',
        key: 'hochiminh',
        id: 62,
        index: 2,
    },
];


export interface OrderingInterface {
    description: string;
    key: string;
}

export const feedbackOrderingList: OrderingInterface[] = [
    { description: 'Xem bài viết gần đây', key: 'recent' },
    { description: 'Xem gợi ý ngẫu nhiên dành cho bạn', key: 'recommend' },
];

export const productOrderingList: OrderingInterface[] = [
    { description: 'Sắp xếp', key: 'recommend' },
    { description: 'Sản phẩm mới', key: 'new_product' },
    { description: 'Giá từ thấp đến cao', key: 'price_low_to_high' },
    { description: 'Giá từ cao đến thấp', key: 'price_high_to_low' },
];

export const getFilterTranslation = (searchingKeyword: string, list: any[]) => {
    let translated = undefined
    list.map(({ key, description }: { key: string; description: string }) => {
        console.log(key, description)
        if (searchingKeyword == key) {
            translated = description
        }
    })
    return translated
}

export enum CategoryEnum {
    top = 'top',
    shoes = 'shoes',
    cap = 'cap',
    underwear = 'underwear',
    bag = 'bag',
    jewelry = 'jewelry',
    outwear = 'outwear',
    set = 'set',
    dress = 'dress',
    pants = 'pants',
    skirt = 'skirt',
}

export enum SocialAccountEnum {
    insta = 'instagram',
    facebook = 'facebook',
    tiktok = 'tiktok',
    youtube = 'youtube',
    website = 'website',
}


@JsonConverter
export class CategoryEnumSerializer extends EnumConverter<CategoryEnum> {
    constructor() {
        super(CategoryEnum, 'CategoryEnum');
    }
}

@JsonConverter
export class StyleKeySerializer extends EnumConverter<StyleKey> {
    constructor() {
        super(StyleKey, 'StyleKey');
    }
}