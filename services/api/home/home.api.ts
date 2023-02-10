import { HandledError } from 'error';
import { get } from 'lodash';
import { JSONType } from 'model';
import {
    Collection,
    CollectionType,
    FlashSaleCollectionImpl,
    ProductCollectionImpl,
    StoreCollectionImpl,
} from 'model/collection';
import { http, Http } from 'services/http/http.service';
import { FetchPreset } from '../api_helper';
import { apiUrl } from '../api_variables';
import { Banner } from './home.api.dto';
import { sleep } from "_helper";

export const getDiscountBanner = async () => {
    try {
        const response = await Http.instance.get<Banner>('v1/campaigns/?banner_type=sale');
        return new Banner().fromJSON(response.data);
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'home.api.getDiscountBanner',
        });
        throw exception;
    }
};

export const getFeedbackBanner = async () => {
    try {
        const response = await Http.instance.get<Banner>('v1/campaigns/?banner_type=feedback');
        return new Banner().fromJSON(response.data);
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'home.api.getFeedbackBanner',
        });
        throw exception;
    }
};

export const getExhibitionProductList = async ({ token, pk, offset = 0 }) => {
    const requestURL = apiUrl + 'publish/exhibition/' + pk + '/?offset=' + offset;
    const responseJson = await FetchPreset({ requestURL, token });
    if (responseJson.product_list) {
        return {
            data: responseJson.product_list,
            totalCount: responseJson.product_list.length,
        };
    } else {
        return {
            data: [],
            totalCount: 0,
        };
    }
};

interface MainBannerDTO {
    count: number;
    results: JSONType[];
}

export const getMainBanner = async (): Promise<Banner[]> => {
    try {
        const response = await http().get<MainBannerDTO>('v1/magazines/');
        const data = get(response, 'data.results', []) as JSONType[];
        const banners = new Banner().fromListJSON(data);

        return banners;
    } catch (error) {
        throw new HandledError({
            error: error as Error,
            stack: 'home.api.getMainBanner',
        });
    }
};


const parseCollection = (value: JSONType): Collection | undefined => {
    const type = get(value, 'type');
    if (!type) return;

    switch (type) {
        case CollectionType.flash_sale:
            const flashsale = new FlashSaleCollectionImpl().fromJSON(
                value,
            ) as FlashSaleCollectionImpl;
            if (flashsale.valid) return flashsale;
            return;
        case CollectionType.store:
            return new StoreCollectionImpl().fromJSON(value);

        case CollectionType.product:
            return new ProductCollectionImpl().fromJSON(value);
        default:
            return;
    }
}

export const getCollectionByIdType = async ({ type, id }: { type: CollectionType, id: number }): Promise<Collection> => {
    try {
        const response = await http().get<JSONType>(`v1/collections/${type}/${id}/`);
        const json = response.data;
        json.type = type;
        const collection = parseCollection(json);
        if (!collection) throw new Error('invalid collection');
        return collection;
    } catch (e) {
        const error = new HandledError({
            error: e as Error,
            stack: 'home.api.getCollectionById',
        });
        throw error;
    }
}

export const getCollection = async (): Promise<Collection[]> => {
    try {
        const response = await http().get<{ results: JSONType[] }>('v1/collections/');
        const results = response.data?.results;
        const collections: Collection[] = [];

        const json: { [id: number]: JSONType } = {}

        results.forEach((value) => {
            const is_active = get(value, 'is_active', false);
            const index = get(value, 'index', null)
            if (!index || !is_active) return;
            json[index] = value;
        })

        Object.values(json).forEach((value) => {
            const type = get(value, 'type');
            const collection = parseCollection(value)
            if (!collection) return;
            collections.push(collection);
        });

        return Promise.resolve(collections);
    } catch (e) {
        const error = new HandledError({
            error: e as Error,
            stack: 'home.api.getCollection',
        });
        throw error;
    }
};