import {createContext} from 'react';
import {Modalize} from 'react-native-modalize';
import {OptionsMap, OptionType, StockData} from 'services/api/cart';

// export type SelectedOption = {
//   [id: string]: {
//     key?: string;
//     name?: string;
//     stock?: number;
//   };
// };

export type SelectedOption = {
    [key in OptionType]: string | undefined;
};

export type ICart = {
    key:string,
    quantity:number
};

export interface IOptionContext {
    selectedOptions: SelectedOption;
    setSelectedOptions: (optionType: OptionType, value: string, reset?:boolean) => void;

    initialOption?: {type:OptionType, key: string};

    quantity?: number;
    setQuantity: (quantity: number) => void;

    optionData: OptionsMap;
    stockData: StockData;
    availableKeys: string[];
    modalRef: Modalize | null;
    reset: () => void;
}

export const initialSelectedOption = {
    [OptionType.color]: undefined,
    [OptionType.size]: undefined,
    [OptionType.extra_option]: undefined,
};

export const OptionContext = createContext<IOptionContext>({
    setQuantity: value => {
        /** */
    },
    availableKeys:[],
    optionData: {},
    stockData: {},
    modalRef: null,
    selectedOptions: initialSelectedOption,
    setSelectedOptions: (_, __) => {
    },
    reset: () => {}
});
