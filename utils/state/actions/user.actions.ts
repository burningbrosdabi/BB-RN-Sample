import {ActionType} from '../action-types';
import {StoreInfo} from "model";

interface SetUserInfo {
    type: ActionType.SET_USER_INFO;
    payload: any;
}

interface SetUserName {
    type: ActionType.SET_USER_NAME;
    payload: string;
}



interface ResetUserState {
    type: ActionType.RESET_USER_STATE;
}

interface SetRecipients {
    type: ActionType.SET_RECIPIENTS;
    payload: [];
}

interface AddRecipient {
    type: ActionType.ADD_RECIPIENT;
    payload: any;
}

interface UpdateRecipient {
    type: ActionType.UPDATE_RECIPIENT;
    payload: any;
}

interface DelRecipient {
    type: ActionType.DEL_RECIPIENT;
    payload: any;
}

interface SetProvincesList {
    type: ActionType.SET_PROVINCES_LIST;
    payload: any;
}

interface SetVouchersList {
    type: ActionType.SET_VOUCHERS_LIST;
    payload: [];
}


export type UserAction =
    | SetUserInfo
    | SetUserName
    | ResetUserState
    | SetRecipients
    | AddRecipient
    | UpdateRecipient
    | DelRecipient
    | SetProvincesList
    | SetVouchersList;
