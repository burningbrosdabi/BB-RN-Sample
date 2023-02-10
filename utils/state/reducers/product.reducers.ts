import { Action } from '../actions';
import { ActionType } from '../action-types';
import { ProductCategory } from 'model';
import { OrderingInterface, ProductColors, productOrderingList } from 'utils/data';

interface ProductState {
  categories: ProductCategory[];
}

const initialState = {
  categories: [],
};

const reducer = (state: ProductState = initialState, action: Action): ProductState => {
  switch (action.type) {
    case ActionType.SET_CATEGORY_LIST:
      return {
        ...state,
        categories: action.payload,
      };
    case ActionType.RESET_FILTER:
      return { ...initialState, categories: state.categories };
    default:
      return state;
  }
};

export default reducer;
