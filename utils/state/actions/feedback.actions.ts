import { ActionType } from '../action-types';

interface SetFeedbackOrdering {
  type: ActionType.SET_FEEDBACK_ORDERING;
}

export type FeedbackAction = SetFeedbackOrdering;
