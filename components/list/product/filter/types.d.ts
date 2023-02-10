import { IProductCategory } from 'model/product/product.category';
import { PatternKey, ProductColors, StyleKey } from 'utils/data';

interface ContextRepo<T> {
  create: (value: T) => void;
  read: () => T;
  update: (value: T) => void;
  delete: () => void;
  repo: T;
}

interface ModalProps {
  route?: FilterModalRoute;
  visible: boolean;
}

interface IFilterModalContext {
  value: ModalProps;
  open: (route: FilterModalRoute) => void;
  close: () => void;
}
interface ModalContext {
  visible: boolean;
  toogle: () => void;
}

export enum FilterModalRoute {
  price = 0,
  color = 1,
  pattern = 2,
  style = 3,
}

export type ICategoryFilter = {
  category: IProductCategory; // { name: 'all', display_name: 'Tất cả' },
  subCategory: IProductCategory;
};

type Filter = {
  patternFilter: PatternKey[];
  colorFilter: ProductColors[];
  styleFilter: StyleKey[];
  priceFilter: [0, null | number];
  isDiscount:boolean;
};

export type { IFilterModalContext, ModalProps, ModalContext, ContextRepo, Filter };
