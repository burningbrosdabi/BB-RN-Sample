import HandledError from 'error/error';
import { get, isEmpty, mapKeys } from 'lodash';
import { JSONType } from 'model/json/json.serializable';
import { CartProductOption, ProductOption } from 'model/product/product.options';
import { StoreMinifiedInfo } from 'model/store/store';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Http } from 'services/http/http.service';
import { removeDiacritics, guard, unAwaited } from 'utils/helper/function.helper';
import {
  CartData,
  IndexMap,
  OptionMap,
  OptionsMap,
  OptionStockDictionary,
  StockData,
  StoreMap,
} from './type';

export const getProductOptions = async (id: number): Promise<[OptionsMap, StockData]> => {
  try {
    const response = await Http.instance.post<{ results: JSONType[] }>(
      `v1/products/${id}/options/`,
    );

    const data = response.data?.results;
    const options = new ProductOption().fromListJSON(data);

    const color: OptionStockDictionary = {};
    const size: OptionStockDictionary = {};
    const extra_option: OptionStockDictionary = {};
    const result: { [id: string]: ProductOption } = {};

    options.map(option => {
      const colorKey = removeDiacritics(option.color);
      const sizeKey = removeDiacritics(option.size);
      const extraKey = removeDiacritics(option.extra_option);

      const setValue = (value: OptionStockDictionary, key: string, name: string, stock: number) => {
        if (value[key]) {
          value[key].stock += stock;
        } else {
          value[key] = {
            name,
            stock,
          };
        }
      };

      // const keys = [colorKey, sizeKey, extraKey].filter((key) => key === '').join('#');
      const keys: string[] = [];
      if (colorKey !== '') {
        setValue(color, colorKey, option.color, option.stock);
        keys.push(colorKey);
      }
      if (sizeKey !== '') {
        keys.push(sizeKey);
        const key = keys.join('.');
        setValue(size, key, option.size, option.stock);
      }
      if (extraKey !== '') {
        keys.push(extraKey);
        const key = keys.join('.');
        setValue(extra_option, key, option.extra_option, option.stock);
      }
      result[keys.join('.')] = option;
    });
    console.log(
      '!!!!',
      JSON.stringify([{ color, size, extra_option }, result /** incart item */], undefined, 4),
    );
    return [{ color, size, extra_option }, result /** incart item */];
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'product.api.getProductOptions',
    });
    throw error;
  }
};

export const colorPrefix = '#color_';
export const sizePrefix = '#size_';
export const extraPrefix = '#extra_';

export const getProductOptionsV2 = async (id: number): Promise<[OptionsMap, StockData]> => {
  try {
    const response = await Http.instance.post<{ results: JSONType[] }>(
      `v1/products/${id}/options/`,
    );

    const data = response.data?.results;
    const options = new ProductOption().fromListJSON(data);

    const color: { [key: string]: string } = {};
    const size: { [key: string]: string } = {};
    const extra_option: { [key: string]: string } = {};
    const result: { [id: string]: ProductOption } = {};

    options.map(option => {
      if (option.stock <= 0) return;
      const colorKey = removeDiacritics(option.color);
      const sizeKey = removeDiacritics(option.size);
      const extraKey = removeDiacritics(option.extra_option);

      const keys: string[] = [];
      if (colorKey !== '') {
        const key = `${colorPrefix}${colorKey}#`;
        color[key] = option.color;
        keys.push(key);
      }
      if (sizeKey !== '') {
        const key = `${sizePrefix}${sizeKey}#`;
        size[key] = option.size;
        keys.push(key);
      }
      if (extraKey !== '') {
        const key = `${extraPrefix}${extraKey}#`;
        extra_option[key] = option.extra_option;
        keys.push(key);
      }
      result[keys.join('.')] = option;
    });
    return [{ color, size, extra_option }, result /** incart item */];
  } catch (e) {
    const error = new HandledError({
      error: e as Error,
      stack: 'product.api.getProductOptions',
    });
    throw error;
  }
};

export const partialAddToCart = async (key: number, quantity: number) => {
  try {
    await Http.instance.post(`/v1/products/${key}/add-to-cart/`, { quantity });
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'product.api.partialAddToCart',
    });
  }
};

export const addToCart = async (cart: {
  [id: string]: {
    quantity: number;
    id: number;
  };
}): Promise<null | { [id: string]: HandledError }> => {
  try {
    const errorMap: { [id: string]: HandledError } = {};
    for (const [key, { id, quantity }] of Object.entries(cart)) {
      await partialAddToCart(id, quantity).catch(error => {
        errorMap[key] = error;
      });
    }
    unAwaited(checkCart());
    if (!isEmpty(errorMap)) {
      return errorMap;
    } else {
      return null;
    }
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'product.api.addToCart',
    });
  }
};

export const OPTION_DELIMITER = '$';

export const getUserCart = async (): Promise<CartData> => {
  try {
    const response = await Http.instance.get<JSONType>('v1/carts/');
    const data = response.data ?? {};
    const sub_carts = get(data, 'sub_carts') as JSONType;
    const indexMap: IndexMap = {};
    const storeMap: StoreMap = {};
    const optionMap: OptionMap = {};

    type NewType = JSONType;

    sub_carts.forEach((cart: NewType) => {
      type NewType_1 = JSONType;

      const storeJson = get(cart, 'store') as NewType_1;
      const store = guard(() => new StoreMinifiedInfo().fromJSON(storeJson));
      if (!store) return;
      const storePk = `${OPTION_DELIMITER}${store.pk}`;

      storeMap[storePk] = store;
      indexMap[`${storePk}`] = {};

      const optionListJson = get(cart, 'items') as JSONType[];

      const inStock: [string, CartProductOption][] = [];
      const outStock: [string, CartProductOption][] = [];

      optionListJson.forEach(json => {
        const option = extractOption(json);
        if (!option) return;
        const key = `${OPTION_DELIMITER}${option.id}`;
        if (option.stock > 0) {
          inStock.push([key, option]);
        } else {
          outStock.push([key, option]);
        }
      });

      const mapping = (stockList: [string, CartProductOption][]) => {
        stockList.forEach(([id, option]) => {
          indexMap[`${storePk}`][id] = true;
          optionMap[`${storePk}.${id}`] = option;
        });
      };

      mapping(inStock);
      mapping(outStock);
    });

    return {
      cartPk: data.pk,
      index: indexMap,
      store: storeMap,
      option: optionMap,
    };
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: 'product.api.getUserCart',
    });
  }
};

export const extractOption = (json: JSONType): CartProductOption | null => {
  try {
    const optionJson = mapKeys(json, (_, key) => {
      if (key === 'product_pk') return key;
      if (key === 'pk') return 'item_id';
      const re = RegExp(/^(option_|product_)/g);

      return key.replace(re, '');
    });
    const option = new CartProductOption().fromJSON(optionJson);

    return option as CartProductOption;
  } catch (e) {
    new HandledError({
      error: e as Error,
      stack: 'product.api.extractOption',
    }).log(true);

    return null;
  }
};

export const clearCart = async (id: number) => {
  try {
    await Http.instance.delete(`v1/carts/${id}/`);
    unAwaited(checkCart());
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'product.api.clearCart',
    });
  }
};

export const clearCartItem = async (id: string) => {
  try {
    await Http.instance.delete(`v1/carts/remove-item/${id}/`);
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: `product.api.clearCartItem.${id}`,
    });
  }
};

export const removeCartItem = async (id: string) => {
  try {
    await Http.instance.delete(`v1/carts/delete-item/${id}/`);
  } catch (error) {
    throw new HandledError({
      error: error as Error,
      stack: `product.api.removeCartItem.${id}`,
    });
  }
};

export const clearMultiCartItem = async (
  ids: string[],
): Promise<null | { [id: string]: HandledError }> => {
  try {
    const errorMap: { [id: string]: HandledError } = {};
    const promises = ids.map(id => {
      return removeCartItem(id).catch(error => {
        errorMap[id] = error;
      });
    });
    await Promise.all(promises);
    unAwaited(checkCart());
    if (!isEmpty(errorMap)) {
      return errorMap;
    } else {
      return null;
    }
  } catch (e) {
    throw new HandledError({
      error: e as Error,
      stack: 'product.api.clearCart',
    });
  }
};

export const cartObservable = new BehaviorSubject(false);

export const checkCart = async () => {
  try {
    const response = await Http.instance.get<{ total_item: number }>('v1/carts/summary/');
    const count = response?.data.total_item ?? 0;
    cartObservable.next(count > 0);
  } catch (error) {}
};

export const clearCartBadge = () => cartObservable.next(false);

export const productOptionColor: { [key: string]: string } = {
  be: '#EDC7A2',
  nude: '#F2DAC4',
  kem: '#FDF1D2',
  den: '#222222',

  xanhduong: '#1A81D3',
  xanhden: '#193978',
  xanhnavy: '#193CB8',
  xanhduongnhat: '#59ADDC',
  xanhngoc: '#BFDDF9',
  nau: '#C28A63',
  naunhat: '#E8B568',
  naudam: '#6A4E47',

  xanhla: '#45C761',
  xanhreu: '#708163',
  xanhma: '#BDCF4C',
  xanhmint: '#4DD1AA',

  xam: '#979899',
  xamxanh: '#A7B1CA',
  xamnhat: '#EAEAEA',
  xamdam: '#5B5B5B',

  cam: '#FF9047',
  hong: '#FFB0C2',
  tim: '#BA7CD1',
  timdam: '#834080',

  do: '#F45151',
  trang: '#FFFFFF',
  vang: '#FFE145',
};

export const optionColorCheck = {
  be: true,
  nude: true,
  kem: true,

  xanhngoc: true,
  xamnhat: true,
  trang: true,
};
