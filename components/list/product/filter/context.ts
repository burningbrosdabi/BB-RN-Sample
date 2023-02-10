import { get } from 'lodash';
import { ProductCategory } from 'model';
import { createContext } from 'react';
import { OrderingInterface, productOrderingList } from 'utils/data';
import {
  ContextRepo,
  Filter,
  FilterModalRoute,
  ICategoryFilter,
  IFilterModalContext,
  ModalContext
} from './types.d';

export default createContext<IFilterModalContext>({
  value: { visible: false, route: FilterModalRoute.price },
  open: (value: FilterModalRoute) => {
    /** */
  },
  close: () => {
    /** */
  },
});

export const CategoryContext = createContext<ModalContext>({
  visible: false,
  toogle: () => {
    /** */
  },
});

export const OrderingContext = createContext<ModalContext>({
  visible: false,
  toogle: () => {
    /** */
  },
});

export const OrderingRepoContext = createContext<ContextRepo<OrderingInterface>>({
  create: (value: OrderingInterface) => { },
  read: () =>
    get(productOrderingList, '[0]', {
      description: 'Sắp xếp',
      key: 'recommend',
    }) as OrderingInterface,
  update: (value: OrderingInterface) => { },
  delete: () => { },
  repo: get(productOrderingList, '[0]', {
    description: 'Sắp xếp',
    key: 'recommend',
  }) as OrderingInterface,
});

export const defaultCatg = { display_name: 'Tất cả', name: 'all' } as ProductCategory;
export const defaultCatgFilter = {
  subCategory: defaultCatg,
  category: defaultCatg,
};

export const CategoryRepoContext = createContext<ContextRepo<ICategoryFilter>>({
  create: (value: ICategoryFilter) => { },
  read: () => defaultCatgFilter,
  update: (value: ICategoryFilter) => { },
  delete: () => { },
  repo: defaultCatgFilter,
});

export const defaultFilter: Filter = {
  patternFilter: [],
  colorFilter: [],
  styleFilter: [],
  priceFilter: [0, null],
};

export const FilterRepoContext = createContext<ContextRepo<Filter>>({
  create: (value: Filter) => { },
  read: () => defaultFilter,
  update: (value: Filter) => { },
  delete: () => { },
  repo: defaultFilter,
});
