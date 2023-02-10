import { ActionType } from '../action-types';
interface SetStoreFilter {
  type: ActionType.SET_STORE_FILTER;
}

interface ResetStoreFilter {
  type: ActionType.RESET_STORE_FILTER;
}

export type StoreAction = SetStoreFilter | ResetStoreFilter;
