import { HandledError } from 'error';
import { JSONType, ProductInfo, StoreMinifiedInfo } from 'model';
import type { CartProductOption } from 'model/product/product.options';
import { ProductColors } from 'utils/data/filter';
import { PickType } from '..';
interface ProductCategoryListResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: JSONType[];
}
interface ProductListFilterInterface {
  offset?: number;
  categoryFilter?: string;
  subCategoryFilter?: string;
  colorFilter?: ProductColors[];
  styleFilter?: string[];
  priceFilter?: [number | null, number | null];
  patternFilter?: string[];
  isDiscount?: boolean | null;
  ordering?: string | null;
  storePk?: number | null;
  query?: string;
  personalization?: boolean;
  limit?: number;
  pickType?: PickType | null;
  next?: string
}
interface ProductListResponse {
  count: number;
  results: JSONType[];
}
export class ProductListDTO {
  totalCount: number;
  data: ProductInfo[];
  next?: string;

  constructor({ count, results }: ProductListResponse) {
    this.totalCount = count ?? 0;
    this.data = [];
    if (!results) this.data = [];
    else {
      try {
        this.data = new ProductInfo().fromListJSON(results) as ProductInfo[];
      } catch (error) {
        throw new HandledError({ error: error as Error, stack: 'ProductListDTO.constructor' });
      }
    }
  }
}

export type {
  ProductCategoryListResponse,
  ProductListFilterInterface,
  ProductListResponse,
};
