import { HandledError } from 'error';
import { JSONType, OrderItem } from 'model';

interface OrderListListResponse {
  count: number;
  results: JSONType[];
}

class OrderListListDTO {
  totalCount: number;
  data: OrderItem[];

  constructor({ count, results }: OrderListListResponse) {

    this.totalCount = count ?? 0;
    this.data = [];
    if (!results) this.data = [];
    else {
      try {
        this.data = new OrderItem().fromListJSON(results) as OrderItem[];
      } catch (error) {
        throw new HandledError({ error: error as Error, stack: 'OrderListListDTO.constructor' });
      }
    }
  }
}


export type { OrderListListResponse, OrderListListDTO };

