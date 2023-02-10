import { HandledError } from 'error';
import { JSONType, CommentItemModel } from 'model';

interface CommentResponse {
  count: number;
  next: string | null;
  results: JSONType[];
}

export class CommentDTO {
  totalCount: number;
  data: CommentItemModel[];

  constructor({ count, results }: CommentResponse) {
    this.totalCount = count ?? 0;
    this.data = [];
    if (!results) this.data = [];
    else {
      try {
        this.data = new CommentItemModel().fromListJSON(results) as CommentItemModel[];
      } catch (error) {
        throw new HandledError({ error: error as Error, stack: 'CommentDTO.constructor' });
      }
    }
  }
}

export type { CommentResponse };

