import { HandledError } from 'error';
import { CollectionType, StoreLandingItem, StoreLandingItemImpl } from 'model/collection';
import { JSONType } from 'model/json/json.serializable';
import { ProductInfo } from 'model/product/product';
import { http } from 'services/http/http.service';
import { PaginationResponse } from 'services/http/type';
import { ProductListDTO } from '../product/product.dtos';

export const getProductCollection = async ({
  type,
  offset,
  pk,
}: {
  type: CollectionType;
  offset: number;
  pk: number;
}): Promise<ProductListDTO> => {
  try {
    const typeKey = `${type === CollectionType.flash_sale ? `flash_sale` : 'product_collection'}`;
    const {
      data: { results, count },
    } = await http().get<{ count: number; results: JSONType[] }>('v1/products/collections/', {
      params: {
        [typeKey]: pk,
        limit: 20,
        offset,
      },
    });

    const productInfo = new ProductInfo().fromListJSON(results) as ProductInfo[];

    return Promise.resolve({
      totalCount: count,
      data: productInfo,
    });
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'api.collection.getProductCollection',
    });
  }
};

export const getStoreCollection = async (pk: number, nextUrl?: string) => {
  try {
    const {
      data: { next, count, previous, results },
    } = await http().get<PaginationResponse<JSONType>>(
      nextUrl ?? `v1/stores/collections/?collection=${pk}&limit=20&offset=0`,
    );

    const data = (new StoreLandingItemImpl().fromListJSON(
      results,
    ) as unknown) as StoreLandingItem[];

    return { next, count, previous, results: data };
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'api.collection.getStoreCollection',
    });
  }
};
