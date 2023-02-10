import { createContext } from 'react';
import { CartData, IndexMap, OptionMap } from 'services/api/cart';

interface ICartContext extends CartData {
  setOptions: (value: OptionMap) => void;
  selectedOption: { [id: string]: boolean };
  setSelectedOption: (value: { [id: string]: boolean }) => void;
  setIndex: (value: IndexMap) => void;
}

export const CartContext = createContext<ICartContext>({
  index: {},
  store: {},
  option: {},
  setOptions: (value) => {
    /** */
  },
  selectedOption: {},
  setSelectedOption: (value) => {
    /** */
  },
  setIndex: (value) => {},
  cartPk: 0,
});
