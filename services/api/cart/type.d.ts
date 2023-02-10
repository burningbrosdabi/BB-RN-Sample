import { CartProductOption, ProductOption } from 'model/product/product.options';
import { StoreMinifiedInfo } from 'model/store/store';

export type OptionStock = {
  name: string;
  stock: number;
};

export enum OptionType {
  color = 'color',
  size = 'size',
  extra_option = 'extra_option',
}

export type OptionsMap = { [key in OptionType]: { [key: string]: string } };

export type OptionStockDictionary = { [id: string]: OptionStock };

export type StockData = {
  [id: string]: ProductOption;
};

type StoreMap = { [id: string]: StoreMinifiedInfo };

type OptionMap = { [id: string]: CartProductOption };

type IndexMap = { [id: string]: { [id: string]: true } };

export type CartData = {
  cartPk: number;
  index: IndexMap;
  store: StoreMap;
  option: OptionMap;
};
