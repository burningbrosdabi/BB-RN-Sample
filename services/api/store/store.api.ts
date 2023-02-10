import { HandledError } from 'error';
import { CommentItemModel, StoreAddress, StoreInfo, StoreListItem, StoreListItemImpl } from 'model';
import { http, Http } from 'services/http/http.service';
import { ageList, cityList, DEFAULT_TOKEN } from 'utils/data';
import { FetchPreset } from '../api_helper';
import { apiUrl } from '../api_variables';
import { StoreAddressListResponse } from './store.dtos';
import AsyncStorage from '@react-native-community/async-storage';
import { storeKey } from 'utils/constant';
import { getUniqueListBy } from 'utils/helper/OrderHelper';
import { PaginationFetch, PaginationResponse } from 'services/http/type';
import { isNil } from 'lodash';

export const convertQueryString = (filterList: any[], originalList: any[]) => {
  const result = filterList?.map((key: string) => {
    const found = originalList.find(res => res.key == key);
    return found?.id;
  });

  let query = result?.join(',') || '';
  return query;
};

// export const getStoreList = async (props?: { offset?: number, cityFilter?: string[], styleFilter?: string[], ageFilter?: string[] }) => {
//     const {offset = 0, cityFilter = [], styleFilter = [], ageFilter = []} = props ?? {};
//     const provinceQuery = convertQueryString(cityFilter, cityList)
//     const ageQuery = convertQueryString(ageFilter, ageList)
//     const styleQuery = styleFilter?.join(",") || ""
//
//     let requestURL = 'v1/stores/?limit=20&offset=' + offset;
//     requestURL += provinceQuery ? `&provinces=${provinceQuery}` : ""
//     requestURL += ageQuery ? `&ages=${ageQuery}` : ""
//     requestURL += styleQuery ? `&style=${styleQuery}` : ""
//
//     const {data} = await http().get(requestURL);
//
//     return {
//         totalCount: data?.count || 0,
//         data: data?.results || [],
//     };
// };

export interface StoreListFilter {
  is_following?: boolean;
  query?: string;
}

export const getStores: PaginationFetch<StoreListItem, StoreListFilter> = async (next, filter) => {
  const { is_following = false, query } = filter ?? {};
  const url = next ?? (is_following ? 'v1/users/stores/follow/' : 'v1/stores/');

  const {
    data: { results, count, next: nextUrl },
  } = await http().get(url, {
    params: isNil(next)
      ? {
          limit: 20,
          offset: 0,
          ...(!isNil(query) ? { q: query.trim() } : undefined),
        }
      : undefined,
  });

  const items = new StoreListItemImpl().fromListJSON(results) as unknown as StoreListItem[];
  return {
    next: nextUrl,
    count,
    previous: null,
    results: items,
  };
};

export const getStoreDetail = async (
  id: number,
  options?: { is_search_result?: boolean },
): Promise<StoreInfo> => {
  try {
    const { is_search_result = false } = options ?? {};
    const response = await http().get<StoreInfo>(`v1/stores/${id}/`, {
      params: !is_search_result ? undefined : { is_search_result: 'True' },
    });
    const data = new StoreInfo().fromJSON(response.data);

    return data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'StoreList.getStoreDetail',
    });
    throw exception;
  }
};

export const getStoreAddress = async (id: number): Promise<StoreAddress[]> => {
  try {
    const response = await http().get<StoreAddressListResponse>(`v1/stores/${id}/get-addresses/`);
    const data = new StoreAddress().fromListJSON(response.data.results);

    return data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'StoreDetail.getStoreAddress',
    });
    throw exception;
  }
};

export const getStoreSearchList = async ({
  query,
  offset = 0,
  cityFilter = [],
  styleFilter = [],
  ageFilter = [],
}) => {
  try {
    if (!query) {
      return { totalCount: 0, data: [] };
    }
    const searchRegExp = /\s/g;
    const replaceWith = '_';
    const query_with_space = query.trim(); // replace(searchRegExp, replaceWith).toLowerCase();
    let requestURL = 'v1/stores/?q=' + query_with_space + '&limit=20&offset=' + offset;

    let provinceQuery = convertQueryString(cityFilter, cityList);
    let ageQuery = convertQueryString(ageFilter, ageList);
    const styleQuery = styleFilter?.join(',') || '';
    requestURL += provinceQuery ? `&provinces=${provinceQuery}` : '';
    requestURL += ageQuery ? `&ages=${ageQuery}` : '';
    requestURL += styleQuery ? `&style=${styleQuery}` : '';
    requestURL = encodeURI(requestURL);

    const {
      data: { count, results },
    } = await http().get(requestURL);
    return {
      totalCount: count,
      data: results,
    };
  } catch {
    return { totalCount: 0, data: [] };
  }
};
