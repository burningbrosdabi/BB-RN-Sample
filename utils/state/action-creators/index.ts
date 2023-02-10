import {createAction} from '@reduxjs/toolkit';
import {HandledError} from "error";
import {Dispatch} from 'redux';
import {http} from "services/http/http.service";
import {
    addFavoriteFeedback,
    delFavoriteFeedback,

} from '_api';
import {ActionType} from '../action-types';
import {Action} from '../actions';

export const setLoading = createAction<boolean>(ActionType.TOGGLE_LOADING);

export const favoriteFeedback = async ({pk, follow}: { pk: number, follow: boolean }) => {
    try {
        if (follow) {
            await addFavoriteFeedback(pk);
        } else {
            await delFavoriteFeedback(pk);
        }
    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'user.favorite.api.favoriteFeedback'
        })
    }

};


export const likeFeed = async ({pk, like}: { pk: number, like: boolean }) => {
    try {
        const url = 'v1/users/posts/like/';
        if (like) {
            await http().post(url, {post: pk});
        } else {
            await http().delete(`${url}${pk}/`,);
        }

    } catch (e) {
        throw new HandledError({
            error: e as Error,
            stack: 'user.favorite.api.favoriteFeedback'
        })
    }

};


export const resetFilter = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({type: ActionType.RESET_FILTER});
    };
};

export const clearMessage = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({type: ActionType.ALERT_CLEAR});
    };
};

export const setStoreFilter = (data: { city: string; style: string; age: string }) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({type: ActionType.SET_STORE_FILTER, payload: data});
    };
};

export const resetStoreFilter = () => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({type: ActionType.RESET_STORE_FILTER});
    };
};

export const setFeedbackOrdering = (data: any) => {
    return async (dispatch: Dispatch<Action>) => {
        dispatch({type: ActionType.SET_FEEDBACK_ORDERING, payload: data});
    };
};

export * from './app.action-creators';
export * from './auth.action-creators';
export * from './magazine.action-creators';
export * from './order.action-creators';
export * from './user.action-creators';
export * from './search.action-creators';

