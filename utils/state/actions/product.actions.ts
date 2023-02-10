import { ProductCategory } from 'model';
import { ActionType } from '../action-types';


interface SetCategoryList {
  type: ActionType.SET_CATEGORY_LIST;
  payload: ProductCategory[];
}

interface ResetFilter {
  type: ActionType.RESET_FILTER;
}


export type ProductAction =  SetCategoryList | ResetFilter ;
