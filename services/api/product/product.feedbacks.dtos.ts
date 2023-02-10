import { HandledError } from 'error';
import { JSONType, ProductUserFeedbackItem } from 'model';

interface ProductUserFeedbacksResponse {
  count: number;
  results: JSONType[];
  average_score: number;
  feedback_summary: any;
}

class ProductUserFeedbacksDTO {
  totalCount: number;
  data: ProductUserFeedbackItem[];
  average_score: number;
  feedback_summary: any;

  constructor({ count, results, average_score, feedback_summary }: ProductUserFeedbacksResponse) {

    this.totalCount = count ?? 0;
    this.data = [];
    this.average_score = average_score;
    this.feedback_summary = feedback_summary;
    if (!results) this.data = [];
    else {
      try {
        this.data = new ProductUserFeedbackItem().fromListJSON(results) as ProductUserFeedbackItem[];
      } catch (error) {
        throw new HandledError({ error: error as Error, stack: 'ProductUserFeedbacksDTO.constructor' });
      }
    }
  }
}


export type { ProductUserFeedbacksResponse, ProductUserFeedbacksDTO };