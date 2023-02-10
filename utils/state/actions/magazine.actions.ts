import { ActionType } from '../action-types';

interface SetTotalComments {
  type: ActionType.SET_TOTAL_COMMENTS;
  payload: any;
}

interface SetComments {
  type: ActionType.SET_COMMENTS;
  payload: any;
}

interface AddComment {
  type: ActionType.ADD_COMMENT;
  payload: any;
}

interface DelComment {
  type: ActionType.DEL_COMMENT;
  payload: any;
}

export type MagazineAction =
  | SetTotalComments
  | SetComments
  | AddComment
  | DelComment
