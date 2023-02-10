import { cityList, ageList } from 'utils/data/filter';
import { ActionType } from 'utils/state/action-types';
import { dispatch, store } from 'utils/state';
import { FetchPreset } from '../api_helper';
import { apiUrl } from '../api_variables';
import { convertQueryString } from '../store/store.api';
import { http } from 'services/http/http.service';
import { FeedbackInfo, JSONType, ProductInfo, StoreInfo } from 'model';
import { HandledError } from 'error';
import { favoriteFeedback, setFavoriteStore } from 'utils/state/action-creators';
import { PaginationFetch, PaginationResponse } from 'services/http/type';
import { get, isNil, reduce } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PartialObserver } from 'rxjs/src/internal/types';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { feedCollectController, feedLikeController } from 'services/user';
import { ProductListDTO, ProductListFilterInterface } from 'services/api/product/product.dtos';

export const addFavoriteFeedback = async (pk: number) => {
  const body = { post_id: pk };
  await http().post('v1/users/posts/collect/', body);
};

export const delFavoriteFeedback = async (pk: number) => {
  await http().delete(`v1/users/posts/collect/${pk}/`);
};

export const getUserFavoriteProducts = async (
  next
): Promise<ProductListDTO> => {
  try {
    const url = next ?? 'v1/users/products/like/';
    const {
      data: { results, count, next: nextUrl },
    } = await http().get(url, {
      params: {
        limit: 20,
      },
    });
    const data = new ProductInfo().fromListJSON(results) as ProductInfo[];
    return {
      totalCount: count,
      next: nextUrl ?? undefined,
      data,
    };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'user.favorite.api.getUserFavoriteProducts',
    });
  }
};

export const getUserFavoriteProductPks = async (
  limit?: number,
): Promise<{ count: number; data: number[] }> => {
  try {
    let lim = limit ?? 20;
    if (!limit) {
      const response = await getUserFavoriteProductPks(1);
      if (response.count <= 0) return response;
      lim = response.count;
    }

    const {
      data: { results, count },
    } = await http().get<{ count: number; results: { pk: number }[] }>('v1/users/products/like/', {
      params: {
        field: 'pk',
        limit: lim,
      },
    });

    const data = results.map(e => e.pk).filter(e => !!e);
    return {
      count,
      data,
    };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'user.favorite.api.getUserFavoriteProducts',
    });
  }
};

export const getUserFavoriteStores = async (params?: {
  limit: number;
  offset: number;
}): Promise<{ totalCount: number; data: string[] }> => {
  try {
    let lim = params?.limit ?? 20;
    if (!params) {
      const { totalCount, data } = await getUserFavoriteStores({ limit: 1, offset: 0 });
      lim = totalCount;
      if (totalCount <= 0) return { data, totalCount };
    }
    const {
      data: { results, count },
    } = await http().get<{ count: number; results: JSONType[] }>(`/v1/users/stores/follow/`, {
      params: {
        field: 'pk',
        limit: lim,
      },
    });
    const data = results.map(e => get(e, 'pk')).filter(e => !!e);

    return { data, totalCount: count };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'user.favorite.api.getUserFavoriteStores',
    });
  }
};

export const getFollowingFeedPk = async (params?: {
  limit: number;
}): Promise<{ count: number; data: number[] }> => {
  try {
    let lim = params?.limit ?? 20;
    if (!params) {
      const { count, data } = await getFollowingFeedPk({ limit: 1 });
      if (count <= 0) return { count, data };
      lim = count;
    }
    const {
      data: { count, results },
    } = await http().get<{ count: number; results: { pk: number }[] }>('v1/users/posts/collect/', {
      params: {
        field: 'pk',
        limit: lim,
      },
    });

    const _data = results.map(e => e.pk).filter(e => !!e);
    return {
      count,
      data: _data,
    };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'user.favorite.api.getFollowingFeedPk',
    });
  }
};

export const getFollowingFeeds: PaginationFetch<FeedbackInfo> = async next => {
  try {
    const url = next ?? 'v1/users/posts/collect/';
    const {
      data: { count, results, next: nextUrl },
    } = await http().get<{ count: number; results: JSONType[]; next: string | null }>(url);
    const feedbacks = new FeedbackInfo().fromListJSON(results);
    console.log(feedbacks)
    return {
      count,
      next: nextUrl ?? undefined,
      previous: null,
      results: feedbacks,
    };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'user.favorite.api.getFollowingFeeds',
    });
  }
};

export const getLikedFeeds = async (limit?: number): Promise<{ count: number; data: number[] }> => {
  try {
    let lim = limit ?? 20;
    if (!limit) {
      const { data, count } = await getLikedFeeds(1);
      if (count <= 0) return { data, count };
      lim = count;
    }

    const url = `v1/users/posts/like/?limit=${lim}&field=pk`;
    const {
      data: { count, results },
    } = await http().get<{ count: number; results: { pk: number }[] }>(url);
    const data = results.map(e => e.pk).filter(e => !!e);

    return {
      count,
      data,
    };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'user.favorite.api.getLikedFeeds',
    });
  }
};

export const getPaginationFavoriteFeedbacks: PaginationFetch<FeedbackInfo> = async (
  nextUrl?: string,
  options?: { offset: number },
) => {
  try {
    const { offset = 0 } = options ?? {};
    const url = nextUrl?.replace('http:', 'https:');
    const {
      data: { next, count, previous, results },
    } = await http().get<PaginationResponse<JSONType>>(url ?? `v1/users/posts/collect/`, {
      params: isNil(nextUrl)
        ? {
          limit: 20,
          offset,
        }
        : undefined,
    });

    return { next, count, previous, results: [] };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'api.feedback.getPaginationFavoriteFeedbacks',
    });
  }
};

export const favoriteStore = async ({ pk, like }: { pk: number; like: boolean }) => {
  if (like) {
    await http().post('v1/users/stores/follow/', { store_id: pk });
  } else {
    await http().delete(`v1/users/stores/follow/${pk}/`);
  }
};

export const favoriteProduct = async ({ pk, like }: { pk: number; like: boolean }) => {
  try {
    if (like) {
      await http().post('v1/users/products/like/', { product_id: pk });
    } else {
      await http().delete(`v1/users/products/like/${pk}/`);
    }
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'user.favorite.api.favoriteProduct',
    });
  }
};

export const feedbackStream = new BehaviorSubject<FeedbackInfo[]>([]);
