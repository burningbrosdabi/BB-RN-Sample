import { ActionAlert } from './alert.actions';
import { AuthAction } from './auth.actions';
import { UserAction } from './user.actions';
import { OrderAction } from './order.actions';
import { ProductAction } from './product.actions';
import { StoreAction } from './store.actions';
import { FeedbackAction } from './feedback.actions';
import { MagazineAction } from './magazine.actions';
import { SearchAction } from './search.actions';
import { ActionType } from '../action-types';

interface setLoadingAction {
  type: ActionType.TOGGLE_LOADING;
}

export type Action = AuthAction | ActionAlert | UserAction | ProductAction | setLoadingAction | StoreAction | FeedbackAction | OrderAction | MagazineAction | SearchAction;
