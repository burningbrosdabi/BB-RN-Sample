import {createStore, applyMiddleware, Store, CombinedState} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer} from 'redux-persist'
import thunk from 'redux-thunk';
import reducers, {RootState} from './reducers';
import AsyncStorage from "@react-native-community/async-storage";
import {PersistConfig} from "redux-persist/es/types";

const persistConfig: PersistConfig<any> = {
    version: 2,
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user', 'auth', 'search']
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store: Store<CombinedState<RootState>, unknown> = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);

export const dispatch = store.dispatch;

