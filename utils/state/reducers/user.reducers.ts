import { IRecipient } from 'model/recipient/recipient';
import { sortData } from 'utils/helper';
import { getUniqueListBy } from 'utils/helper/OrderHelper';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import { ProductInfo, StoreInfo } from 'model';
import { UserInfo } from "model/user/user";


interface UserState {
    userInfo: UserInfo;
    recipients: IRecipient[];
    provinces: any[];
    vouchers: any[];
    userFavoriteProducts: ProductInfo[];
}

const initialState: UserState = {
    userInfo: {
        is_staff: false,
        insta_id: undefined,
        facebook_id: undefined,
        tiktok_id: undefined,
        youtube_id: undefined,
        etc_id: undefined,
        insta_pk: undefined,
        description: "",
        following: 0,
        follower: 0,
        post_count: 0,
        user_type: 'NORMAL',
        information_status: undefined,
        region: 0,
        id: 0,
        user_id: '',
        email: '',
        name: '',
        phone_number: '',
        age: '',
        primary_style: undefined,
        secondary_style: undefined,
        height: undefined,
        weight: undefined,
        gender: '',
        get_user_favorite_stores_count: 0,
        get_user_favorite_products_count: 0,
        feedback_count: 0,
        profile_image: undefined,
        is_require_fb_connect: false,
        order_count_summary: {
            confirmed_count: 0,
            waiting_count: 0,
            shipping_count: 0,
            shipped_count: 0,
            cancel_count: 0,
            exchange_refund_count: 0,
        },
        following_count: 0,
    },
    recipients: [],
    provinces: [],
    vouchers: [],
    userFavoriteProducts: [],
};

const reducer = (state: UserState = initialState, action: Action): UserState => {
    switch (action.type) {
        case ActionType.SET_USER_INFO:
            console.log(action)
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    ...action.payload,
                },
            };
        case ActionType.SET_USER_NAME:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    name: action.payload,
                },
            };
        case ActionType.SET_RECIPIENTS:
            let data = JSON.parse(JSON.stringify(action.payload));
            return {
                ...state,
                recipients:
                    Array.isArray(data) && data.length > 0
                        ? [data[0], ...sortData(data?.slice(1), 'recipient_name')]
                        : [],
            };
        case ActionType.ADD_RECIPIENT:
            let _newList = JSON.parse(JSON.stringify(state.recipients));
            if (action.payload.primary) {
                // update old item
                const indexOfPrimary = state.recipients.findIndex((res) => res.primary);
                indexOfPrimary !== -1 ? (_newList[indexOfPrimary].primary = false) : undefined;
                // update new item
                _newList.unshift(action.payload);
            } else {
                _newList = state.recipients.concat(action.payload);
            }
            return {
                ...state,
                recipients: [_newList[0], ...sortData(_newList.slice(1), 'recipient_name')],
            };
        case ActionType.UPDATE_RECIPIENT:
            let newList = JSON.parse(JSON.stringify(state.recipients));
            const indexOf = state.recipients.findIndex((res) => res.id === action.payload?.id);
            if (indexOf !== -1) {
                if (action.payload.primary) {
                    // update old item
                    const indexOfPrimary = state.recipients.findIndex((res) => res.primary);
                    indexOfPrimary !== -1 ? (newList[indexOfPrimary].primary = false) : undefined;
                    // update new item
                    newList.splice(indexOf, 1);
                    newList.unshift(action.payload);
                } else {
                    newList[indexOf] = action.payload;
                }
            }
            return {
                ...state,
                recipients: [newList[0], ...sortData(newList.slice(1), 'recipient_name')],
            };
        case ActionType.DEL_RECIPIENT:
            let newList_ = state.recipients.filter((item) => item.id !== action.payload.id);
            // in case delete primary item
            if (action.payload.primary && newList_.length > 0) {
                newList_[0].primary = true;
            }

            return {
                ...state,
                recipients: newList_,
            };
        case ActionType.SET_PROVINCES_LIST:
            return {
                ...state,
                provinces: action.payload ?? [],
            };
        case ActionType.SET_VOUCHERS_LIST:
            return {
                ...state,
                vouchers: action.payload ?? [],
            };
        case ActionType.RESET_USER_STATE:
            return {
                ...initialState,
            };
        default:
            return state;
    }
};

export default reducer;
