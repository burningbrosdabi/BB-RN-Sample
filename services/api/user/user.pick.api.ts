import { HandledError } from 'error';
import { head, isEmpty, pick } from 'lodash';
import { JSONType, ProductInfo } from 'model';
import { IPickAB, PickAB, PickResult, } from 'model/pick/pick';
import { http, Http } from 'services/http/http.service';
import { apiUrl } from '../api_variables';
import { ProductListDTO, ProductListFilterInterface } from "services/api/product/product.dtos";

export const NUMB_OF_PICKS = 8;

export const getUserPickProducts = async (options?: ProductListFilterInterface): Promise<ProductListDTO> => {
    try {
        const { offset = 0 } = options ?? {};
        const {
            data: {
                count,
                results
            }
        } = await Http.instance.get<{ count: number, results: JSONType[] }>(`v1/picks/products/`, {
            params: {
                offset,
                limit: 20,
            }
        });

        const data = new ProductInfo().fromListJSON(results ?? []) as ProductInfo[];

        return {
            totalCount: count,
            data,
        }
    } catch (error) {
        throw new HandledError({
            error: error as Error,
            stack: 'user.pick.api.getUserPickProducts',
        });
    }
};


export const getPickABList = async () => {
    try {
        const response = await Http.instance.get<IPickAB[]>(`v1/picks/ab/?sets=${NUMB_OF_PICKS}`);
        return new PickAB().fromListJSON(response.data ?? []) as IPickAB[]
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'feedback.api.getPickABList'
        })
    }
}

export const getPickIn6List = async () => {
    try {
        const response = await Http.instance.get<IPickAB[]>(`v1/picks/in6/?sets=${NUMB_OF_PICKS}`);
        return new PickAB().fromListJSON(response.data ?? []) as IPickAB[]
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'feedback.api.getPickIn6List'
        })
    }
}

export const getUserPickRecommendation = async (type: PickType, options?: ProductListFilterInterface): Promise<ProductListDTO> => {
    try {
        const { offset = 0 } = options ?? {};
        const {
            data: {
                count,
                results
            }
        } = await Http.instance.get<{ count: number, results: JSONType[], }>(`v1/products/`, {
            params: {
                'picked-type': type,
                'limit': 20,
                'offset': offset,
            }

        });

        const products = new ProductInfo().fromListJSON(results ?? []) as ProductInfo[];

        return {
            totalCount: count,
            data: products
        }
    } catch (error) {
        throw new HandledError({
            error: error as Error,
            stack: 'user.pick.api.getUserPickProducts',
        });
    }
};


export enum PickType {
    ON_BOARDING = 0,
    IN6 = 1,
    AB_PICK = 2
}

interface postPickResultProps {
    type: PickType // ON_BOARDING, IN6SET_PICK, AB_PICK = 0,1,2
    picks: {
        pick_id: number;
    }[]
}

export const postPickResult = async ({ type, picks }: postPickResultProps): Promise<PickResult> => {
    try {
        if (picks.length <= 0) throw new Error('Cannot create feed without pick result');
        await http().post('/v1/picks/results/', {
            pick_type: type,
            userpickresultdetails_set: picks
        });
        return await getPickResult(type);
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'pick.api.postPickResult',
        })
    }
}

export const postPickShareStatus = async () => {
    try {
        await http().post('/v1/picks/results/share/', {
            is_shared: true,
        });
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'pick.api.postPickShareStatus',
        })
    }
}


export const getPickResult = async (type: PickType) => {
    try {
        const response = await Http.instance.get(`v1/picks/results/?pick-type=${type}`);
        return new PickResult().fromJSON(response.data)

    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'pick.api.getPickResult'
        })
    }
}

export const createPickAB = async ({ token, pickResults }) => {
    const createUserPickInfoAPIURL = apiUrl + 'pick/pick-ab/create/';
    const results = await Promise.all(
        pickResults.map(async ({ pick_A, pick_B, selection }) => {
            const options = {
                method: 'POST',
                mode: 'cors',
                headers: {
                    Authorization: 'token ' + token,
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: JSON.stringify({
                    pick_A: pick_A,
                    pick_B: pick_B,
                    selection,
                }),
            };
            const result = await fetch(createUserPickInfoAPIURL, options)
                .then((response) => response.json())
                .then((responseJson) => {
                    return responseJson;
                });
            return result;
        }),
    );
    return results;
};
