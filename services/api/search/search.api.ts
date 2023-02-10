import { Http, http } from 'services/http/http.service';
import { HandledError } from 'error';
import { SearchHistoryListDTO, SearchHistoryListResponse } from 'services/api/user/user.dtos';
import { JSONType } from 'model';
import { RelatedProduct, RelatedProductImpl } from 'model/product/related.product';
import { HashTag, HashTagImpl, Keyword, KeywordImpl, StoreKeyword, StoreKeywordImpl, UserKeyword, UserKeywordImpl } from 'model/search/keyword';
import { apiUrl } from 'services/api/api_variables';
import { dispatch, store } from 'utils/state';
import {
  removeSearch,
  removeSearchKeyword,
  removeSearchProductKeyword,
  removeSearchStoreKeyword,
  setSearchKeyword,
} from 'utils/state/action-creators';
import { remove, slice } from 'lodash';

const parseListKeyword = (json?: JSONType[]) => {
  if (!json) throw new Error('Empty list keyword');
  return json.map((val: JSONType) => {
    if (!val?.keyword) return;
    return val.keyword;
  });
};

export const getAdvertiseKeyword = async () => {
  try {
    const { data } = await http().get('advertisement/search-recommendation/');
    return parseListKeyword(data.results);
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'search.api.getAdvertiseKeyword',
    });
  }
};

export const getHotHashtag = async () => {
  try {
    const { data } = await http().get('v1/recommendation_hashtags/');
    return parseListKeyword(data.results);
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'search.api.getAdvertiseKeyword',
    });
  }
};

export const getSearchHistory = async (): Promise<Keyword[]> => {
  try {
    if (!isLogined()) return slice(Object.values(store.getState().search.keyword), 0, 5);

    const url = `v1/search/histories/?limit=5`;
    const { data } = await http().get<SearchHistoryListResponse>(url);
    return new KeywordImpl().fromListJSON(data.results);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'user.api.getSearchHistoryList',
    });
    throw exception;
  }
};

export const deleteSearchHistory = async (keyword: Keyword) => {
  try {
    if (!isLogined()) {
      dispatch(removeSearchKeyword(keyword));
      return;
    }
    const url = `v1/search/histories/${keyword.pk}/`;
    http().delete(url);
  } catch (error) {
    /***/
  }
};

export const getSearchProductHistory = async (): Promise<RelatedProduct[]> => {
  try {
    if (!isLogined()) {
      return slice(Object.values(store.getState().search.product), 0, 3);
    }
    const url = `v1/search/product-histories/?limit=3`;
    const { data } = await http().get<{ results: JSONType[] }>(url);
    return new RelatedProductImpl().fromListJSON(data.results);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'user.api.getSearchProductHistory',
    });
    throw exception;
  }
};

export const deleteSearchProductHistory = async (pk: number) => {
  try {
    if (!isLogined()) {
      dispatch(removeSearchProductKeyword(pk));
      return;
    }
    const url = `v1/search/product-histories/${pk}/`;
    http().delete(url);
  } catch (error) {
    /***/
  }
};

export const getSearchStoreHistory = async (): Promise<StoreKeyword[]> => {
  try {
    if (!isLogined()) {
      return slice(Object.values(store.getState().search.store), 0, 5);
    }

    const url = `v1/search/store-histories/?limit=3`;
    const { data } = await http().get<{ results: JSONType[] }>(url);
    return new StoreKeywordImpl().fromListJSON(data.results);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'user.api.getSearchProductHistory',
    });
    throw exception;
  }
};

export const deleteSearchStoreHistory = async (pk: number) => {
  try {
    if (!isLogined()) {
      dispatch(removeSearchStoreKeyword(pk));
      return;
    }

    const url = `v1/search/store-histories/${pk}/`;
    http().delete(url);
  } catch (error) {
    /***/
  }
};

export const searchUser = async ({ query }: { query: string }): Promise<UserKeyword[]> => {
  try {
    const { data } = await http().get<{ results: JSONType[] }>('v1/users/', {
      params: {
        q: query.trim(),
        limit: 3,
      },
    });

    return new UserKeywordImpl().fromListJSON(data.results);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'user.api.searchUser',
    });
    throw exception;
  }
};


export const searchHashtag = async ({ query }: { query: string }): Promise<HashTag[]> => {
  try {
    const { data } = await http().get<{ results: JSONType[] }>('v1/influencers/feedbacks/hashtags/', {
      params: {
        q: query.trim(),
        limit: 3,
      },
    });

    return new HashTagImpl().fromListJSON(data.results);
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'user.api.searchHashtag',
    });
    throw exception;
  }
};

export const saveSearchKeyword = async (keyword: Keyword) => {
  try {
    if (!isLogined()) {
      dispatch(setSearchKeyword(keyword));
      return;
    }
    http().post('v1/search/histories/', {
      keyword: keyword.keyword,
    });
  } catch (error) { }
};

export const clearSearchHistory = async () => {
  try {
    if (!isLogined()) {
      dispatch(removeSearch());
      return;
    }
    await http().post('v1/search/histories/clear/', {});
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'search.api.clearSearchHistory'
    })
  }
};

const isLogined = () => {
  return store.getState().auth.isLoggedIn;
};
