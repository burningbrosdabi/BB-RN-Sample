import { HandledError } from 'error';
import { JSONType, SearchItem } from 'model';

interface SearchHistoryListResponse {
  count: number;
  results: JSONType[];
}

class SearchHistoryListDTO {
  totalCount: number;
  data: SearchItem[];

  constructor({ count, results }: SearchHistoryListResponse) {

    this.totalCount = count ?? 0;
    this.data = [];
    if (!results) this.data = [];
    else {
      try {
        this.data = new SearchItem().fromListJSON(results) as SearchItem[];
      } catch (error) {
        throw new HandledError({ error: error as Error, stack: 'SearchHistoryListDTO.constructor' });
      }
    }
  }
}


export type { SearchHistoryListResponse, SearchHistoryListDTO };

