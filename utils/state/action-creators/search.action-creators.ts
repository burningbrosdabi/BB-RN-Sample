import { createAction } from "@reduxjs/toolkit";
import { ActionType } from "utils/state/action-types";
import { Keyword, StoreKeyword, UserKeyword } from "model/search/keyword";
import { RelatedProduct } from "model/product/related.product";

export const setSearchKeyword = createAction<Keyword>(ActionType.SET_SEARCH_KEYWORD);
export const removeSearchKeyword = createAction<Keyword>(ActionType.REMOVE_SEARCH_KEYWORD);

export const setSearchStoreKeyword = createAction<StoreKeyword>(ActionType.SET_SEARCH_STORE_KEYWORD);
export const setSearchUserKeyword = createAction<UserKeyword>(ActionType.SET_SEARCH_STORE_KEYWORD);

export const removeSearchStoreKeyword = createAction<number>(ActionType.REMOVE_SEARCH_STORE_KEYWORD);

export const setSearchProductKeyword = createAction<RelatedProduct>(ActionType.SET_SEARCH_PRODUCT_KEYWORD);
export const removeSearchProductKeyword = createAction<number>(ActionType.REMOVE_SEARCH_PRODUCT_KEYWORD);
export const removeSearch = createAction<undefined>(ActionType.REMOVE_SEARCH);