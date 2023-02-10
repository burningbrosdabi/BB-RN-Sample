import { HandledError } from 'error';
import { JSONType, UserFeedbackItem } from 'model';

interface UserFeedbacksResponse {
  count: number;
  results: JSONType[];
}

class UserFeedbacksDTO {
  totalCount: number;
  data: UserFeedbackItem[];

  constructor({ count, results }: UserFeedbacksResponse) {

    this.totalCount = count ?? 0;
    this.data = [];
    if (!results) this.data = [];
    else {
      try {
        this.data = new UserFeedbackItem().fromListJSON(results) as UserFeedbackItem[];
      } catch (error) {
        throw new HandledError({ error: error as Error, stack: 'UserFeedbacksDTO.constructor' });
      }
    }
  }
}


export type { UserFeedbacksResponse, UserFeedbacksDTO };

