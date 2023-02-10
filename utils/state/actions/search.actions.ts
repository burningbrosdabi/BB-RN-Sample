import { ActionType } from 'utils/state/action-types';
import { Keyword, StoreKeyword } from 'model/search/keyword';
import { RelatedProduct } from 'model/product/related.product';

interface SetSearchKeyword {
  type: ActionType.SET_SEARCH_KEYWORD;
  payload: Keyword;
}

interface RemoveSearchKeyword {
  type: ActionType.REMOVE_SEARCH_KEYWORD;
  payload: Keyword;
}

interface SetSearchStoreKeyword {
  type: ActionType.SET_SEARCH_STORE_KEYWORD;
  payload: StoreKeyword;
}

interface RemoveSearchStoreKeyword {
  type: ActionType.REMOVE_SEARCH_STORE_KEYWORD;
  payload: number;
}

interface SetSearchProductKeyword {
  type: ActionType.SET_SEARCH_PRODUCT_KEYWORD;
  payload: RelatedProduct;
}

interface RemoveSearchProductKeyword {
  type: ActionType.REMOVE_SEARCH_PRODUCT_KEYWORD;
  payload: number;
}

interface RemoveSearch {
  type: ActionType.REMOVE_SEARCH;
  payload:undefined,
}

export type SearchAction =
  | SetSearchKeyword
  | RemoveSearchKeyword
  | SetSearchStoreKeyword
  | RemoveSearchStoreKeyword
  | SetSearchProductKeyword
  | RemoveSearchProductKeyword
  | RemoveSearch;
