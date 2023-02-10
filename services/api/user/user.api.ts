import AsyncStorage from '@react-native-community/async-storage';
import { HandledError } from 'error';
import { get, isNil, isUndefined } from "lodash";
import { JSONType, ProductInfo, StoreInfo, StyleItem } from "model";
import { UserInfoImpl } from "model/user/user";
import { http, Http } from 'services/http/http.service';
import { storeKey } from 'utils/constant';
import { DEFAULT_TOKEN } from 'utils/data';
import { dispatch, store } from 'utils/state';
import { setUserInfo } from 'utils/state/action-creators';
import { FetchPreset } from '../api_helper';
import { apiUrl } from '../api_variables';
import { ProductListDTO, ProductListFilterInterface, ProductListResponse } from '../product/product.dtos';
import { SearchHistoryListDTO, SearchHistoryListResponse } from './user.dtos';
import { UserFeedbacksDTO, UserFeedbacksResponse } from './user.feedbacks.dtos';
import { Subject } from "rxjs";
import { PaginationResponse } from 'services/http/type';

export const updateUserName = async (token, name) => {
    const updateUserNameAPIURL = apiUrl + 'user/me/name/';
    const options = {
        method: 'PUT',
        mode: 'cors',
        headers: {
            Authorization: 'token ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            name: name,
        }),
    };
    const result = await fetch(updateUserNameAPIURL, options)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.name;
        });
    return result;
};

export const getUserName = async (token) => {
    const requestURL = apiUrl + 'user/me/';
    const responseJson = await FetchPreset({ requestURL, token });
    return responseJson.name;
};

export const getUserInfo = async () => {
    try {
        const requestURL = 'user/me/';
        const { data } = await http().get<JSONType>(requestURL);
        const user = new UserInfoImpl().fromJSON(data);
        dispatch(setUserInfo(user));

        return data;
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'user.api.getUserInfo'
        })
    }
};

export let productWatchedStream = new Subject<number>();

export const getUserWatchedProducts = async (props?: { offset: number }) => {
    try {
        const { offset = 0 } = props ?? {};
        const requestURL = `user/me/view/product/?limit=20&offset=${offset}`;
        const { data: { count, results } } = await http().get<{ count: number, results: JSONType[] }>(requestURL);
        for (const result of results) {
            if (result.store) {
                result.store = get(result, 'store.insta_id', null);
            }
        }
        const products = new ProductInfo().fromListJSON(results);

        return { totalCount: count, data: products };
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'user.favorite.api.getUserWatchedProducts'
        })
    }
};

export const getUserWatchedProductsList = async ({ offset = 0 }: ProductListFilterInterface) => {
    // const requestURL = apiUrl + 'user/me/view/product/?limit=20&offset=' + offset;
    try {
        const url = `user/me/view/product/?limit=20&offset=${offset}`;
        const response = await Http.instance.get<ProductListResponse>(url);

        return {
            totalCount: response.data.count,
            data: response.data.results,
        } as ProductListDTO;
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'user.api.getUserWatchedProducts',
        });
        throw exception;
    }
};

export const updateUserOnboardingData = async ({ data }: { data: StyleItem[] }): Promise<void> => {
    try {
        const body = {
            userpickresultdetails_set: data?.map((res) => {
                return {
                    pick_id: res.pk,
                };
            }),
        };
        const response = await Http.instance.post('pick/results/', body);
        console.log(response)
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'AuthApi.updateOnboardingData',
        });
        throw exception;
    }
};

export const getFollowingStoreUpdate = async (params?: { offset?: number }) => {
    const { offset = 0 } = params ?? {};
    const { data: { count, results } } = await http().get(`v1/users/following-stores/?limit=15&offset=${offset}`)

    return { totalCount: count, data: results };
};

export const getUserFeedbacksApi = async ({ offset = 0 }: { offset?: number }) => {
    try {
        const url = `v1/users/feedbacks/?limit=20&offset=${offset || 0}`;
        console.log(url);

        const response = await Http.instance.get<UserFeedbacksResponse>(url);
        console.log(response);

        return {
            totalCount: response.data.count,
            data: response.data.results,
        } as UserFeedbacksDTO;
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'user.api.getUserFeedbacksApi',
        });
        throw exception;
    }
};

export const updateAvatarApi = async ({ profile_image }: { profile_image: string }) => {
    try {
        const url = `auth/user/`;
        let formData = new FormData();
        formData.append('profile_image', profile_image);
        const response = await Http.instance.patch(url, formData);
        return response.data;
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'user.api.updateAvatarApi',
        });
        throw exception;
    }
};

export const updateUserApi = async ({
    name,
    description,
    user_id,
    insta_id,
    facebook_id,
    tiktok_id,
    youtube_id,
    etc_id,
    weight,
    height,
    is_pass_onboarding = false,
    primary_style,
    secondary_style,
}: {
    user_id?: string,
    name?: string,
    description?: string,
    insta_id?: string | null,
    facebook_id?: string | null,
    tiktok_id?: string | null,
    youtube_id?: string | null,
    etc_id?: string | null,
    weight?: number,
    height?: number,
    is_pass_onboarding?: boolean
    primary_style?: string,
    secondary_style?: string,
}) => {
    try {
        const url = `auth/user/`;
        let updatedUserInformation: {
            user_id?: string,
            name?: string,
            description?: string,
            insta_id?: string | null,
            facebook_id?: string | null,
            tiktok_id?: string | null,
            youtube_id?: string | null,
            etc_id?: string | null,
            weight?: number,
            height?: number,
            is_pass_onboarding?: boolean
            primary_style?: string,
            secondary_style?: string,
        } = {}
        !isUndefined(user_id) && (updatedUserInformation.user_id = user_id)
        !isUndefined(name) && (updatedUserInformation.name = name)
        !isUndefined(description) && (updatedUserInformation.description = description)
        !isUndefined(weight) && (updatedUserInformation.weight = weight)
        !isUndefined(height) && (updatedUserInformation.height = height)

        !isUndefined(insta_id) && (updatedUserInformation.insta_id = insta_id)
        !isUndefined(facebook_id) && (updatedUserInformation.facebook_id = facebook_id);
        !isUndefined(tiktok_id) && (updatedUserInformation.tiktok_id = tiktok_id);
        !isUndefined(youtube_id) && (updatedUserInformation.youtube_id = youtube_id);
        !isUndefined(etc_id) && (updatedUserInformation.etc_id = etc_id);

        !isUndefined(primary_style) && (updatedUserInformation.primary_style = primary_style);
        !isUndefined(secondary_style) && (updatedUserInformation.secondary_style = secondary_style);

        is_pass_onboarding != false && (updatedUserInformation.is_pass_onboarding = true);

        const response = await Http.instance.patch(url, updatedUserInformation);
        const user = new UserInfoImpl().fromJSON(response.data);
        dispatch(setUserInfo(user));

        return response.data;
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'user.api.updateUserApi',
        });
        if (isNil(exception.rootError?.response)) return exception.rootError?.response
        throw exception;
    }

}


// export const getUserInfo = async () => {
//     try {
//         const requestURL = 'user/me/';
//         const { data } = await http().get<JSONType>(requestURL);
//         const user = new UserInfoImpl().fromJSON(data);
//         dispatch(setUserInfo(user));

//         return data;
//     } catch (e) {
//         throw new HandledError({
//             error: e as Error,
//             stack: 'user.api.getUserInfo'
//         })
//     }
// };
/** @deprecated   */
export const deprecated_updateUserInfo = async ({
    token,
    age,
    region,
    gender = null
}: {
    token: string,
    age?: string,
    region?: any,
    gender?: any
}) => {
    const updateUserBasicInfoAPIURL = apiUrl + 'user/me/basic/';
    const body = JSON.stringify({ age, region, gender }, (key, value) => {
        if (value !== null && value !== undefined) return value
    })
    const options = {
        method: 'PATCH',
        mode: 'cors',
        headers: {
            Authorization: 'token ' + token,
            Accept: 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: body,
    };
    const result = await fetch(updateUserBasicInfoAPIURL, options)
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson?.age || responseJson?.region || responseJson?.gender) {
                store.dispatch(setUserInfo(responseJson))
            }
            return responseJson;
        });
    return result;
};

export const getUserList = async (
    nextUrl?: string,
    options?: {
        offset?: number;
        query?: string;
        limit?: number
    },
): Promise<PaginationResponse<UserInfoImpl>> => {

    try {
        const { offset = 0, limit = 20, query } = options ?? {};
        const url = nextUrl?.replace('http:', 'https:');
        const {
            data: { next, count, previous, results },
        } = await http().get<PaginationResponse<JSONType>>(url ?? `v1/users/`, {
            params: isNil(nextUrl)
                ? {
                    limit,
                    offset,
                    ...(query ? { 'q': query } : undefined),
                }
                : undefined,
        });

        const data = new UserInfoImpl().fromListJSON(results) as unknown as UserInfoImpl[];
        console.log(data)
        return { next, count, previous, results: data };
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'api.user.getUserList',
        });
    }
};


export const getFollowRecommendationList = async (
    nextUrl?: string,
): Promise<PaginationResponse<UserInfoImpl>> => {

    try {
        const url = nextUrl?.replace('http:', 'https:');
        const {
            data: { next, count, previous, results },
        } = await http().get<PaginationResponse<JSONType>>(url ?? `v1/influencers/recommendation/`, {});

        const data = new UserInfoImpl().fromListJSON(results) as unknown as UserInfoImpl[];
        return { next, count, previous, results: data };
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'api.user.getFollowRecommendationList',
        });
    }
};



export const createSocialViewLog = async ({ pk, type }: { pk: number, type: number }): Promise<void> => {
    try {
        const response = await Http.instance.post(`v1/influencers/${pk}/social_logs/`, { social_type: type });
        console.log(response)
    } catch (error) {
        const exception = new HandledError({
            error: error as Error,
            stack: 'api.user.createSocialViewLog',
        });
        throw exception;
    }
};