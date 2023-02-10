export interface ICoupon {
  id: number;
  created: string;
  modified: string;
  code: string;
  name: string;
  description: string;
  scope: number;
  type: number;
  minimum_amount: number;
  usage_limit: number;
  percent_off: number;
  amount_off: number;
  quantity: number;
  activate_date: string;
  deactivate_date: null;
  pk: number;
  availability: number;
}
