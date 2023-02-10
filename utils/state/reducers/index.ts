import { combineReducers } from 'redux';
import auth from './auth.reducers';
import alert from './alert.reducers';
import user from './user.reducers';
import loading from './loading.reducers';
import product from './product.reducers';
import app from './app.reducer';
import store from './store.reducers';
import order from './order.reducers';
import feedback from './feedback.reducers';
import comment from './comment.reducers';
import search from './search.reducer';
import { ActionType } from '../action-types';

const reducers = combineReducers({
  auth,
  alert,
  user,
  product,
  loading,
  app,
  store,
  feedback,
  order,
  comment,
  search
});

//https://www.cluemediator.com/how-to-reset-the-state-of-a-redux-store
const rootReducer = (state, action) => {
  if (action.type === ActionType.RESET_STORE) {
    state = undefined;
  }
  return reducers(state, action);
};
export default rootReducer;

export type RootState = ReturnType<typeof reducers>;
