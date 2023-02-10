import { HandledError } from 'error';
import { JSONType } from 'model';
import { Http } from 'services/http/http.service';

interface VoucherResponse {
  count: number;
  results: JSONType[];
}

export const getVouchersList = async ({ offset = 0 }: { offset?: number }): Promise<any> => {
  try {
    const response = await Http.instance.get<VoucherResponse>(`v1/discounts/coupons/?limit=20&offset=${offset}`);

    return { totalCount: response.data.count, data: response.data.results };
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'voucher.get',
    });
    throw exception;
  }
};

export const searchVouchers = async ({ code, offset = 0 }: { code: string, offset?: number }): Promise<any> => {
  try {
    const response = await Http.instance.get<VoucherResponse>(`v1/discounts/coupons/?code=${code}&limit=1000&offset=${offset}`);

    return { totalCount: response.data.count, data: response.data.results };
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'voucher.search',
    });
    throw exception;
  }
};