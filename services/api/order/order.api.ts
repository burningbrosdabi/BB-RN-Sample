import { HandledError } from 'error';
import { OrderItem, OrderItemType } from 'model';
import { Http } from 'services/http/http.service';
import { OrderListListDTO, OrderListListResponse } from './order.dtos';
import { OrderStatus, OrderStatusMap } from 'scenes/order/orderHistory/type';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getUserInfo } from 'services/api';

export const getOrderListApi = async ({
  order_status,
  offset = 0,
}: {
  order_status: OrderStatus;
  offset?: number;
}) => {
  try {
    const response = await Http.instance.get<OrderListListResponse>('v1/orders/', {
      params: {
        limit: 20,
        offset,
        order_status: OrderStatusMap[order_status],
      },
    });
    return {
      totalCount: response.data.count,
      data: response.data.results,
    } as OrderListListDTO;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'order.api.getOrderList',
    });
    throw exception;
  }
};

export const getOrderDetailApi = async (code: string) => {
  try {
    const url = `v1/orders/${code}/`;
    const response = await Http.instance.get<OrderItemType>(url);
    const data = new OrderItem().fromJSON(response.data);
    return data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'order.api.getOrderDetail',
    });
    throw exception;
  }
};

export const getCancelReasonsApi = async () => {
  try {
    const response = await Http.instance.get('v1/orders/cancel-reasons/');
    console.log(response);
    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'order.api.getCancelReasonsApi',
    });
    throw exception;
  }
};

export const cancelOrderApi = async (pk: number, body: any) => {
  const _body = JSON.stringify(body, (key, value) => {
    if (value !== null && value !== undefined && value !== '') return value;
  });
  try {
    const url = `v1/orders/${pk}/cancel/`;
    const response = await Http.instance.post(url, JSON.parse(_body));
    orderStatusStream.next({ pk, status: OrderStatus.cancelled });
    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'order.api.cancelOrderApi',
    });
    throw exception;
  }
};

export const completeOrderApi = async (pk: number) => {
  try {
    const url = `v1/orders/${pk}/completed/`;
    const response = await Http.instance.post(url);

    orderStatusStream.next({ pk, status: OrderStatus.delivered });
    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'order.api.completeOrderApi',
    });
    throw exception;
  }
};

export const getExchangeReasonsApi = async () => {
  try {
    const response = await Http.instance.get('v1/orders/exchange-reasons/');

    console.log(response);
    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'order.api.getCancelReasonsApi',
    });
    throw exception;
  }
};

export const exchangeOrderApi = async (order_id: number, params: any) => {
  try {
    const { item_ids = [] } = params;
    const url = `v1/exchanges/${order_id}/request/?item_ids=${item_ids.join(',')}`;
    let formData = new FormData();
    formData.append('reason', params.reason);
    if (params.message) {
      formData.append('message', params.message);
    }
    (params.images || []).forEach((element: any, index: number) => {
      formData.append(`image_${index + 1}`, element.base64);
    });
    if (params.email) {
      formData.append('email', params.email);
    }

    const response = await Http.instance.post(url, formData);
    orderStatusStream.next({ pk: order_id, status: OrderStatus.exchanged });
    return response.data;
  } catch (error) {
    const exception = new HandledError({
      error: error as Error,
      stack: 'order.api.completeOrderApi',
    });
    throw exception;
  }
};

export const orderStatusStream = new Subject<{ pk: number; status: OrderStatus }>();

orderStatusStream.pipe(debounceTime(200)).subscribe(({ pk, status }) => {
  if (status === OrderStatus.exchanged || status === OrderStatus.cancelled) {
    getUserInfo();
  }
});

export const productFeedbackStream = new Subject<{ orderPk: number; optionPk: number }>();
