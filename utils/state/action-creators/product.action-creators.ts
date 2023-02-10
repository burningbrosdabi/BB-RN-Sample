import { createAction } from '@reduxjs/toolkit';
import { defaultCatg } from 'components/list/product/filter/context';
import { HandledError } from 'error';
import { isEmpty } from 'lodash';
import { ProductCategory, ProductSubcategory } from 'model';
import data from 'utils/data/category.json';
import { isProduction } from 'utils/helper';
import { ActionType } from '../action-types';
import { store } from '../store';

const setCategoryList = createAction<ProductCategory[]>(ActionType.SET_CATEGORY_LIST);

export const loadCategory = (): ProductCategory[] => {
  try {
    let categories = store.getState().product.categories;
    if (!isEmpty(categories)) {
      return categories;
    }

    categories = new ProductCategory().fromListJSON(
      isProduction() ? data['production'] : data['staging'],
    );
    const categoryAll = new ProductCategory();
    categoryAll.name = 'all';
    categoryAll.display_name = 'Tất cả';

    categories.unshift(categoryAll);

    categories.forEach((category, index) => {
      category.productsubcategory_set.unshift(
        ProductSubcategory.factory({ ...defaultCatg, is_active: true }),
      );
    });

    store.dispatch(setCategoryList(categories));
    return categories;
  } catch (error) {
    throw new HandledError({ error: error as Error, stack: 'loadCategory' });
  }
};
