import {Action} from "utils/state/actions";
import {ActionType} from "utils/state/action-types";
import {Keyword, StoreKeyword} from "model/search/keyword";
import {RelatedProduct} from "model/product/related.product";
import {isNil} from "lodash";

interface State {
    keyword: { [pk: string]: Keyword },
    // ['store_<id>'] : StoreKeyword
    store: { [pk: string]: StoreKeyword },
    product: { [pk: string]: RelatedProduct },
}

const initialState: State = {
    keyword: {},
    store: {},
    product: {},
};

export default (state: State = initialState, action: Action): State => {
    const keywords = state.keyword;
    switch (action.type) {
        case ActionType.SET_SEARCH_KEYWORD:
            return {
                ...state,
                keyword: updateKeyword(
                    {...keywords},
                    action.payload,
                )
            };

        case ActionType.REMOVE_SEARCH_KEYWORD:
            console.log('aaaaa', state.keyword, action.payload.pk)
            delete (state.keyword[parseKey(action.payload.pk)]);
            console.log('bbbbb', state.keyword)
            return {...state, keyword: {...keywords}}

        case ActionType.SET_SEARCH_STORE_KEYWORD:
            return {
                ...state,
                store: updateObject<StoreKeyword>(
                    {...state.store},
                    parseStoreKey(action.payload.pk),
                    action.payload,
                )
            };
        case ActionType.REMOVE_SEARCH_STORE_KEYWORD:
            delete (state.store[parseStoreKey(action.payload)]);
            return {...state, store: {...state.store}}

        case ActionType.SET_SEARCH_PRODUCT_KEYWORD:
            return {
                ...state,
                product: updateObject<RelatedProduct>(
                    {...state.product},
                    parseProductKey(action.payload.pk),
                    action.payload,
                )
            };

        case ActionType.REMOVE_SEARCH_PRODUCT_KEYWORD:
            delete (state.product[parseProductKey(action.payload)]);
            return {...state, product: {...state.product}};

        case ActionType.REMOVE_SEARCH:
            return initialState;

        default:
            return state;
    }
};

const parseKey = (pk: number) => {
    return `key_${pk}`;
}

const parseStoreKey = (pk: number) => {
    return `store_${pk}`;
}

const parseProductKey = (pk: number) => {
    return `product_${pk}`;
}

const updateObject = <V>(repository: { [pk: string]: V }, key: string, value: V) => {
    const exist = !isNil(repository[key]);
    let results = {};
    if (exist) {
        delete (repository[key]);
    }

    results = {[key]: value, ...repository}
    return results;
}

const updateKeyword = (repository: { [pk: string]: Keyword }, value: Keyword) => {

    const key = Object.keys(repository).find((key) => {
        return value.keyword === repository[key].keyword;
    });

    let results = {};
    if (!isNil(key)) {
        delete (repository[key]);
    }

    results = {[parseKey(value.pk)]: value, ...repository}
    return results;
}