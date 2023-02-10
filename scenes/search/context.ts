import { createContext } from 'react';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import ProductSubcategory from '../../model/product/product.subcategory';
import { Subject } from 'rxjs';

type ISearchContext = {
  textStream: BehaviorSubject<string>;
  subcatg: ProductSubcategory[];
  catgMap: { [id: string]: string };
  subCateNameMap: { [id: string]: string };
};

export const SearchContext = createContext<ISearchContext>({
  textStream: new BehaviorSubject<string>(''),
  subcatg: [],
  catgMap: {},
  subCateNameMap: {},
});

type ISearchHistoryContext = {
  empty: { keyword: boolean; store: boolean; product: boolean };
  setEmpty: (key: 'keyword' | 'store' | 'product', value: boolean) => void;
  removeStream: Subject<undefined>;
};

export const SearchHistoryContext = createContext<ISearchHistoryContext>({
  empty: { keyword: false, store: false, product: false },
  setEmpty: (key: 'keyword' | 'store' | 'product', value: boolean) => {
    /**/
  },
  removeStream: new Subject(),
});
