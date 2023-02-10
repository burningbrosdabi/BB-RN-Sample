import {useContext, useMemo} from "react";
import {IOptionContext, OptionContext, SelectedOption} from "scenes/checkout/Cart/context";
import {first} from "lodash";
import {StockData} from "services/api/cart";

export const getSelectedStock = () => {
    const { selectedOptions, stockData, availableKeys } = useContext<IOptionContext>(OptionContext);

    const key = useMemo<string | undefined>(() => {
        if (availableKeys.length !== 1) return undefined;
        return first(availableKeys);
    }, [availableKeys, selectedOptions]);

    return {  key };
};

const getOptionDisplayedName = (id: string, preCalcOptions: StockData, options: SelectedOption) => {
    const calcOption = preCalcOptions[id];
    const calcOptionJson = calcOption.toJSON();
    const availableOptionKeys = Object.keys(options);
    const displayName = availableOptionKeys.map(key => calcOptionJson[key]).join(' / ');

    return displayName;
};