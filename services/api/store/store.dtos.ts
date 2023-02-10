import { JSONType } from 'model';

interface StoreAddressListResponse {
  count: number;
  next: number | null;
  previous: number | null;
  results: JSONType[];
}


export type { StoreAddressListResponse };

