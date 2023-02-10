import AsyncStorage from '@react-native-community/async-storage';
import { HandledError, ProductApiErrorCode } from 'error';
import { isEmpty, isNil, omit } from 'lodash';
import { FeedbackInfo, IProduct, JSONType, ProductCategory, ProductDetail } from 'model';
import { RelatedProductListDTO, RelatedProductListResponse } from 'model/product/related.product';
import { http, Http } from 'services/http/http.service';
import { PaginationResponse } from 'services/http/type';
import { storeKey } from 'utils/constant';
import { getUniqueListBy } from 'utils/helper/OrderHelper';
import {
  ProductCategoryListResponse,
  ProductListDTO,
  ProductListFilterInterface,
  ProductListResponse
} from './product.dtos';
import { ProductUserFeedbacksDTO, ProductUserFeedbacksResponse } from './product.feedbacks.dtos';

export const getProduct = async (productPk: number, options?: { is_search_result: boolean }): Promise<ProductDetail> => {
  try {
    const { is_search_result } = options ?? {}
    const url = `v1/products/${productPk}/${is_search_result ?
      '?is_search_result=True' : ''}`;
    console.log(url)
    const response = await Http.instance.get<IProduct>(url);

    const data = new ProductDetail().fromJSON(response.data) as ProductDetail;
    return data;
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'ProductApi.getProduct',
    });
  }
};

export const getAffiliateLink = async (productPk: number) => {
  try {
    const response = await Http.instance.get(`/v1/products/${productPk}/generate_affiliate_link/`)
    return response.data

  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'ProductApi.getAffiliateLink',
    });
  }
}

export const LIST_LIMIT = 20;

export const getProductList = async ({
  offset = 0,
  limit = LIST_LIMIT,
  categoryFilter = 'all',
  subCategoryFilter = 'all',
  colorFilter = [],
  styleFilter = [],
  priceFilter = [null, null],
  patternFilter = [],
  isDiscount = null,
  ordering = null,
  storePk = null,
  query,
  personalization,
  pickType = null
}: ProductListFilterInterface): Promise<ProductListDTO> => {
  try {
    let orderQuery = '';
    switch (ordering) {
      case 'new_product':
        orderQuery = `?order-by=-created_at`;
        break;
      case 'price_low_to_high':
        orderQuery = `?order-by=final_price`;
        break;
      case 'price_high_to_low':
        orderQuery = `?order-by=-final_price`;
        break;
      default:
        break;
    }
    const preparedParams: { [id: string]: string | null | number | string[] } = {
      q: query ? query.trim() : null,
      limit,
      offset,
      'color-category': !isEmpty(colorFilter) ? colorFilter : null,
      style: !isEmpty(styleFilter) ? styleFilter : null,
      pattern: !isEmpty(patternFilter) ? patternFilter.filter((item) => item !== 'color') : null,
      category: categoryFilter !== 'all' ? categoryFilter : null,
      'sub-category': subCategoryFilter !== 'all' ? subCategoryFilter : null,
      'min-price': priceFilter[0],
      'max-price': priceFilter[1],
      'is-discount': isDiscount ? 'True' : null,
      store: storePk,
      'picked-type': pickType ? pickType : null,
    };
    const params: { [id: string]: string } = {};
    Object.keys(preparedParams).forEach((key) => {
      const value = preparedParams[key];
      if (!isNil(value)) params[key] = `${value}`;
    });
    let url = '';
    if (!isNil(query)) {
      if (query) {
        AsyncStorage.getItem(storeKey.searchHistoryList).then((result) => {
          const historyList = result ? JSON.parse(result) : [];
          historyList.unshift({
            keyword: query,
          });
          const newList = getUniqueListBy(historyList, 'keyword');
          AsyncStorage.setItem(storeKey.searchHistoryList, JSON.stringify(newList));
        });
      }
      url = `v1/products/`;
    } else if (personalization) {
      url = `v1/products/personalization/`;
    } else {
      url = `v1/products/`;
    }

    url += orderQuery;
    url = encodeURI(url);

    const response = await http().get<ProductListResponse>(url, { params });

    const data = new ProductListDTO(response.data);

    return data;
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'ProductApi.getProductList',
      code: ProductApiErrorCode.GET_FILTERED_PRODUCT_LIST_ERROR,
    });
  }
};

export const getCategoryList = async (): Promise<ProductCategory[]> => {
  try {
    const response = await http().get<ProductCategoryListResponse>(
      'product/category-list/',
    );
    const data = new ProductCategory().fromListJSON(response.data.results);

    return data;
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'ProductApi.getCategoryList',
    });
  }
};

export const getProductFeedback = async (nextUrl?: string,
  options?: { pk: number },): Promise<PaginationResponse<FeedbackInfo>> => {
  try {
    const { pk } = options ?? {};
    const url = nextUrl?.replace('http:', 'https:');
    const {
      data: { next, count, previous, results },
    } = await http().get<PaginationResponse<JSONType>>(url ??
      `v1/influencers/feedbacks/?related_product_id=${pk}`,
    );
    const data = new FeedbackInfo().fromListJSON(results);
    return { next, count, previous, results: data };

  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'product.api.getProductFeedback',
    });
  }
};

export const feedbackProductApi = async (pk: number, params: any) => {
  try {
    const url = `v1/products/${pk}/feedbacks/`;
    let formData = new FormData();
    formData.append('order_item', params.order_item);
    formData.append('is_anonymous', params.is_anonymous);
    formData.append('score', params.score);
    if (params.content) {
      formData.append('content', params.content);
    }
    (params.images || []).forEach((element: any, index: number) => {
      formData.append(`image_${index + 1}`, element.base64);
    });
    const response = await Http.instance.post(url, formData);


    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'product.api.feedbackProductApi',
    });
    throw exception;
  }
};

export const getProductUserFeedbacksApi = async ({
  pk,
  offset = 0,
  limit = 20,
  score,
}: {
  pk: number;
  offset?: number;
  limit?: number;
  score?: number;
}) => {
  try {
    const url =
      `v1/products/${pk}/feedbacks/?limit=${limit}&offset=${offset || 0}` +
      (score && score > 0 ? `&score=${score}` : '');
    const response = await Http.instance.get<ProductUserFeedbacksResponse>(url);
    return {
      totalCount: response.data.count,
      data: response.data.results,
      average_score: response.data.average_score,
      feedback_summary: response.data.feedback_summary,
    } as ProductUserFeedbacksDTO;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'product.api.getProductUserFeedbacksApi',
    });
    throw exception;
  }
};



export const getTaggedProduct = async ({ pk, offset = 0,
  limit = 20
}: { pk: number, offset?: number, limit?: number, getCount: boolean }) => {
  try {

    const url = `v1/influencers/${pk}/tagged-products/?limit=${limit}&offset=${offset || 0}`;

    const response = await http().get<RelatedProductListResponse>(url);
    const data = new RelatedProductListDTO(response.data);
    return data
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'ProductApi.getTaggedProduct',
    });
  }
};